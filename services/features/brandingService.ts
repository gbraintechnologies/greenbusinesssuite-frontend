import authApi from "../meshAuthClient";
import multipartMeshApi from "../multipartMeshClient";

export const getAllBranding = () => {
  return () =>
    authApi.get(`/company-branding/all/0/100`).then((res) => res.data);
};

export const deleteBranding = (id: any) => {
  return authApi.delete(`/company-branding/delete/${id}`);
};

export const getBrandingByCompanyId = (companyId: string | number) => {
  return authApi
    .get(`/company-branding/find-by-company-id/${companyId}`)
    .then((res) => res.data);
};

export const uploadBrandingLogoByCompanyId = (
  companyId: string | number,
  file: File,
) => {
  const formData = new FormData();
  formData.append("file", file);
  // Do not set Content-Type — axios/browser must add the multipart boundary
  return multipartMeshApi.post(
    `/company-branding/company/${companyId}/logo`,
    formData,
  );
};

export const uploadBrandingLogoByTenancyId = (
  tenancyId: string,
  file: File,
) => {
  const formData = new FormData();
  formData.append("file", file);
  return multipartMeshApi.post(
    `/company-branding/tenancy/${tenancyId}/logo`,
    formData,
  );
};

export const deleteBrandingLogoByCompanyId = (companyId: string | number) => {
  return authApi.delete(`/company-branding/company/${companyId}/logo`);
};

export const deleteBrandingLogoByTenancyId = (tenancyId: string) => {
  return authApi.delete(`/company-branding/tenancy/${tenancyId}/logo`);
};
