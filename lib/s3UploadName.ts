/**
 * Build a path-safe filename for `/s3/resource/upload/{file}`.
 * Original names (e.g. WhatsApp images with spaces) often 500 on the API.
 */
export function sanitizeS3UploadName(
  file: File | { name?: string; type?: string },
  prefix = "upload"
) {
  const original = file?.name || "";
  const rawExt = (original.split(".").pop() || "").toLowerCase();
  const typeExt = (file?.type || "").split("/")[1]?.toLowerCase();
  const candidate = /^[a-z0-9]+$/.test(rawExt)
    ? rawExt
    : typeExt && /^[a-z0-9]+$/.test(typeExt)
      ? typeExt.replace("jpeg", "jpg")
      : "jpg";
  const ext = candidate === "jpeg" ? "jpg" : candidate;
  const safePrefix = String(prefix).replace(/[^a-z0-9-]/gi, "") || "upload";
  return `${safePrefix}-${Date.now()}.${ext}`;
}
