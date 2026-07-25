/**
 * Client-side image downscaling/compression.
 *
 * Large photos (multi‑MB phone captures) get rejected by the upload endpoint
 * with a 413 "Content Too Large". Resizing + re-encoding to JPEG on the client
 * keeps avatars/logos small enough to upload reliably.
 */

export interface CompressImageOptions {
  /** Max width/height in px. The image is scaled to fit inside this box. */
  maxSize?: number;
  /** JPEG quality between 0 and 1. */
  quality?: number;
  /** Only compress when the file is larger than this many bytes. */
  compressAboveBytes?: number;
}

const DEFAULTS: Required<CompressImageOptions> = {
  maxSize: 512,
  quality: 0.82,
  compressAboveBytes: 300 * 1024, // 300 KB
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Resizes/compresses an image file. Returns a new File, or the original file
 * unchanged if it's already small, isn't an image, or compression fails.
 */
export async function compressImage(
  file: File,
  options: CompressImageOptions = {}
): Promise<File> {
  const { maxSize, quality, compressAboveBytes } = { ...DEFAULTS, ...options };

  // Skip non-images (e.g. SVG can't be drawn/re-encoded reliably) and tiny files
  if (
    typeof window === "undefined" ||
    !file.type.startsWith("image/") ||
    file.type === "image/svg+xml" ||
    file.size <= compressAboveBytes
  ) {
    return file;
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const img = await loadImage(objectUrl);

    const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
    const targetW = Math.max(1, Math.round(img.width * scale));
    const targetH = Math.max(1, Math.round(img.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;

    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, targetW, targetH);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality)
    );

    if (!blob) return file;

    // If compression somehow made it bigger, keep the original
    if (blob.size >= file.size) return file;

    const newName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], newName, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } catch {
    return file;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
