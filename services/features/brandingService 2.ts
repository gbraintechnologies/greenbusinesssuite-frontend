import authApi from "../meshAuthClient";

export const getAllBranding = () => {
  return () =>
    authApi.get(`/company-branding/all/0/100`).then((res) => res.data);
};

export const deleteBranding = (id: any) => {
  return authApi.delete(`/company-branding/delete/${id}`);
};
