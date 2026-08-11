import defaultMeshApi from "../defaultMeshClient";
import authApi from "../meshAuthClient";
import multipartMeshApi from "../multipartMeshClient";
import type { CompanyBrandingPayload } from "@/types";

/** Create a new company branding record */
export const createCompanyBranding = (
  companyId: string | number,
  tenantId: string,
  logo: string,
  color: string,
  companyName: string,
  moduleIds: string[] = [],
  categorySpecificModuleIds: string[] = []
) => {
  return authApi.post("/company-branding/create", {
    tenancyId: tenantId,
    companyId,
    logo,
    color,
    companyName,
    moduleIds,
    categorySpecificModuleIds,
  });
};

/** Update company branding (includes id) */
export const editCompanyBranding = (
  id: string | number,
  companyId: string | number,
  tenantId: string,
  logo: string,
  color: string,
  companyName: string,
  coreModuleIds: string[] = [],
  categorySpecificModuleIds: string[] = []
) => {
  return defaultMeshApi.put(`/company-branding/update`, {
    id,
    tenancyId: tenantId,
    companyId,
    logo,
    color,
    companyName,
    moduleIds: coreModuleIds,
    categorySpecificModuleIds,
  });
};

/** Alias for editCompanyBranding with an object payload */
export const updateCompanyBranding = (payload: CompanyBrandingPayload) => {
  return defaultMeshApi.put(`/company-branding/update`, {
    id: payload.id,
    tenancyId: payload.tenancyId,
    companyId: payload.companyId,
    logo: payload.logo,
    color: payload.color,
    companyName: payload.companyName,
    moduleIds: payload.moduleIds ?? [],
    categorySpecificModuleIds: payload.categorySpecificModuleIds ?? [],
  });
};

/** GET branding by record ID */
export const getCompanyBrandingById = (id: string | number) => {
  return () =>
    defaultMeshApi
      .get(`/company-branding/${id}`)
      .then((res) => res.data);
};

/** GET branding by tenancy / company identifier */
export const getCompanyBrandingByTenancyId = (tenancyId: string) => {
  return () =>
    defaultMeshApi
      .get(`/company-branding/find-by-tenancy-id/${tenancyId}`)
      .then((res) => res.data);
};

/** Backwards-compatible alias used across the app */
export const getCompanyBranding = getCompanyBrandingByTenancyId;

/** Paginated list of all company brandings */
export const getAllBranding = (page: number = 0, size: number = 20) => {
  return () =>
    authApi
      .get(`/company-branding/all/${page}/${size}`)
      .then((res) => res.data);
};

/** DELETE branding by record ID */
export const deleteBrandingById = (id: string | number) => {
  return authApi.delete(`/company-branding/delete/${id}`);
};

/** Backwards-compatible alias */
export const deleteBranding = deleteBrandingById;

/** DELETE branding by tenant / tenancy ID */
export const deleteBrandingByTenantId = (tenantId: string) => {
  return authApi.delete(`/company-branding/tenant/${tenantId}`);
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
