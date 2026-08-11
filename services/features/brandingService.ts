import defaultMeshApi from "../defaultMeshClient";
import meshApi from "../meshAuthClient";
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
  return meshApi.post("/company-branding/create", {
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
    meshApi
      .get(`/company-branding/all/${page}/${size}`)
      .then((res) => res.data);
};

/** DELETE branding by record ID */
export const deleteBrandingById = (id: string | number) => {
  return meshApi.delete(`/company-branding/delete/${id}`);
};

/** Backwards-compatible alias */
export const deleteBranding = deleteBrandingById;

/** DELETE branding by tenant / tenancy ID */
export const deleteBrandingByTenantId = (tenantId: string) => {
  return meshApi.delete(`/company-branding/tenant/${tenantId}`);
};
