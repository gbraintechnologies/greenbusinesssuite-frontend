import authApi from "../meshAuthClient";
import multipartMeshApi from "../multipartMeshClient";

export const getBusinessProfileOfUser = (userId: string) => {
  return () =>
    authApi.get(`/business-profiles/user/${userId}`).then((res) => res.data);
};

export const getMediaTypeByID = (id: number) => {
  return () => authApi.get(`/media/${id}`).then((res) => res.data);
};

export const createBusinessProfile = (data: any) => {
  const formData = new FormData();

  for (const [key, value] of Object.entries(data)) {
    formData.append(key as string, value as any);
  }

  return multipartMeshApi.post(`/business-profiles`, formData);
};

export const updateBusinessProfile = (data: any) => {
  return authApi.put(`/business-profiles`, data);
};
