import authApi from "../meshAuthClient";
import multipartMeshApi from "../multipartMeshClient";
import { extractFileUrl } from "@/hooks/useFileUpload";
import { compressImage } from "@/lib/imageCompression";

export const getMediaByType = (
  type: "BLOGS" | "VIDEOS" | "ADS",
  page: number,
  size: number
) => {
  return () =>
    authApi
      .get(`/media/filter-media/${type}/${page}/${size}`)
      .then((res) => res.data);
};

export const getFilteredMedia = (search: string) => {
  return () => authApi.get(`/media/search/${search}`).then((res) => res.data);
};

function sanitizeUploadName(file: File) {
  const rawExt = (file.name.split(".").pop() || "jpg").toLowerCase();
  const ext = /^[a-z0-9]+$/.test(rawExt) ? rawExt : "jpg";
  return `media-${Date.now()}.${ext}`;
}

async function uploadThumbnailToS3(file: File) {
  const prepared = await compressImage(file, {
    maxSize: 1280,
    quality: 0.82,
    compressAboveBytes: 150 * 1024,
  });
  const safeName = sanitizeUploadName(prepared);
  const formData = new FormData();
  formData.append("file", prepared, safeName);

  const data = await multipartMeshApi
    .post(`/s3/resource/upload/${safeName}`, formData, { timeout: 120_000 })
    .then((res) => res.data);
  const url = extractFileUrl(data);
  if (!url) {
    throw new Error("Thumbnail uploaded but no file URL was returned");
  }
  return url;
}

function mediaPayloadFromFormData(formData: FormData, thumbnailUrl: string) {
  return {
    mediaType: String(formData.get("mediaType") || "ADS"),
    thumbnail: thumbnailUrl,
    altText: String(formData.get("altText") || ""),
    heading: String(formData.get("heading") || ""),
    url: String(formData.get("url") || ""),
    isActive: String(formData.get("isActive")) === "true",
  };
}

/**
 * Create media. POST /media with a raw file currently 500s, so upload
 * the thumbnail to S3 first, then create the record with the URL.
 */
export const mediaUpload = async (formData: FormData) => {
  const thumbnail = formData.get("thumbnail");
  let thumbnailUrl =
    typeof thumbnail === "string" && thumbnail.trim() ? thumbnail.trim() : "";

  if (thumbnail instanceof File) {
    thumbnailUrl = await uploadThumbnailToS3(thumbnail);
  }

  if (!thumbnailUrl) {
    const error: any = new Error("A thumbnail image is required");
    error.response = {
      status: 400,
      data: { message: "A thumbnail image is required" },
    };
    throw error;
  }

  const payload = mediaPayloadFromFormData(formData, thumbnailUrl);

  try {
    return await authApi.post("/media", payload);
  } catch (jsonError: any) {
    const status = jsonError?.response?.status;
    if (status === 415 || status === 405) {
      const retry = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        retry.append(key, String(value));
      });
      return multipartMeshApi.post("/media", retry);
    }
    throw jsonError;
  }
};

export const S3BucketFileUpload = async (formData: FormData, file: string) => {
  const original = formData.get("file");
  if (original instanceof File) {
    const prepared = await compressImage(original, {
      maxSize: 1280,
      quality: 0.82,
      compressAboveBytes: 150 * 1024,
    });
    const safeName = sanitizeUploadName(prepared);
    const next = new FormData();
    next.append("file", prepared, safeName);
    return multipartMeshApi.post(`/s3/resource/upload/${safeName}`, next, {
      timeout: 120_000,
    });
  }

  const safeName = sanitizeUploadName(
    new File([""], file || "upload.jpg", { type: "image/jpeg" })
  );
  return multipartMeshApi.post(`/s3/resource/upload/${safeName}`, formData, {
    timeout: 120_000,
  });
};

export const getMediaTypeByID = (id: number) => {
  return () => authApi.get(`/media/${id}`).then((res) => res.data);
};

export const deleteMediaTypeByID = (id: any) => {
  return authApi.delete(`/media/${id}`);
};

export const searchMediaByHeading = (heading: string) => {
  return authApi.get(`/media/search/${heading}`).then((res) => res.data);
};

export const searchMedia = (heading: string, mediaType: string) => {
  return authApi
    .get(`/media/search/${heading}/${mediaType}`)
    .then((res) => res.data);
};

export const changeStatus = (id: number, isActive: any) => {
  return authApi.put(`/media/status/${id}/${isActive}`);
};

export const updateMediaType = (data: any) => {
  return authApi.put(`/media`, data);
};

export const filterMediaByTimeline = (
  mediaType: string,
  timeline: string,
  page: number,
  size: number
) => {
  return () =>
    authApi
      .get(`/media/findBy-range/${mediaType}/${timeline}/${page}/${size}`)
      .then((res) => res.data);
};
