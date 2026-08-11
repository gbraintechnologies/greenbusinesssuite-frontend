import defaultMeshApi from "../defaultMeshClient";
import authApi from "../meshAuthClient";
import multipartMeshApi from "../multipartMeshClient";
import type { CompanyBrandingPayload } from "@/types";

/** Create a new company branding record — POST /company-branding/create */
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

/** Update company branding — PUT /company-branding/update */
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

/** GET /company-branding/{id} */
export const getCompanyBrandingById = (id: string | number) => {
  return () =>
    defaultMeshApi.get(`/company-branding/${id}`).then((res) => res.data);
};

/** GET /company-branding/find-by-tenancy-id/{tenancyId} */
export const getCompanyBrandingByTenancyId = (tenancyId: string) => {
  return () =>
    defaultMeshApi
      .get(`/company-branding/find-by-tenancy-id/${tenancyId}`)
      .then((res) => res.data);
};

/** Backwards-compatible alias used across the app */
export const getCompanyBranding = getCompanyBrandingByTenancyId;

/** GET /company-branding/find-by-company-id/{companyId} */
export const getBrandingByCompanyId = (companyId: string | number) => {
  return () =>
    authApi
      .get(`/company-branding/find-by-company-id/${companyId}`)
      .then((res) => res.data);
};

/** GET /company-branding/all/{page}/{size} */
export const getAllBranding = (page: number = 0, size: number = 20) => {
  return () =>
    authApi
      .get(`/company-branding/all/${page}/${size}`)
      .then((res) => res.data);
};

/** DELETE /company-branding/delete/{id} */
export const deleteBrandingById = (id: string | number) => {
  return authApi.delete(`/company-branding/delete/${id}`);
};

/** Backwards-compatible alias */
export const deleteBranding = deleteBrandingById;

/** DELETE /company-branding/tenant/{tenantId} */
export const deleteBrandingByTenantId = (tenantId: string) => {
  return authApi.delete(`/company-branding/tenant/${tenantId}`);
};

/** POST /company-branding/company/{companyId}/logo */
export const uploadBrandingLogoByCompanyId = (
  companyId: string | number,
  file: File
) => {
  const formData = new FormData();
  formData.append("file", file);
  return multipartMeshApi
    .post(`/company-branding/company/${companyId}/logo`, formData)
    .then((res) => res.data);
};

/** POST /company-branding/tenancy/{tenancyId}/logo */
export const uploadBrandingLogoByTenancyId = (
  tenancyId: string,
  file: File
) => {
  const formData = new FormData();
  formData.append("file", file);
  return multipartMeshApi
    .post(`/company-branding/tenancy/${tenancyId}/logo`, formData)
    .then((res) => res.data);
};

/** DELETE /company-branding/company/{companyId}/logo */
export const deleteBrandingLogoByCompanyId = (companyId: string | number) => {
  return authApi.delete(`/company-branding/company/${companyId}/logo`);
};

/** DELETE /company-branding/tenancy/{tenancyId}/logo */
export const deleteBrandingLogoByTenancyId = (tenancyId: string) => {
  return authApi.delete(`/company-branding/tenancy/${tenancyId}/logo`);
};

/**
 * Upload a branding logo via company id when available, otherwise tenancy id.
 * Returns the normalized logo URL from the API response when present.
 */
export const uploadBrandingLogo = async ({
  companyId,
  tenancyId,
  file,
}: {
  companyId?: string | number | null;
  tenancyId?: string | null;
  file: File;
}) => {
  if (companyId != null && companyId !== "") {
    return uploadBrandingLogoByCompanyId(companyId, file);
  }
  if (tenancyId) {
    return uploadBrandingLogoByTenancyId(tenancyId, file);
  }
  throw new Error("Company ID or tenancy ID is required to upload a logo");
};

/** Delete branding logo via company id when available, otherwise tenancy id. */
export const deleteBrandingLogo = async ({
  companyId,
  tenancyId,
}: {
  companyId?: string | number | null;
  tenancyId?: string | null;
}) => {
  if (companyId != null && companyId !== "") {
    return deleteBrandingLogoByCompanyId(companyId);
  }
  if (tenancyId) {
    return deleteBrandingLogoByTenancyId(tenancyId);
  }
  throw new Error("Company ID or tenancy ID is required to delete a logo");
};
