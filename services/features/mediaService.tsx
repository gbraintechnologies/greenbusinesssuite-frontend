import authApi from "../meshAuthClient";
import multipartMeshApi from "../multipartMeshClient";

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

export const mediaUpload = (formData: FormData) => {
  return multipartMeshApi.post("/media", formData);
};

export const S3BucketFileUpload = (formData: FormData, file: string) => {
  const url = `/s3/resource/upload/${file}`;
  return multipartMeshApi.post(url, formData);
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
