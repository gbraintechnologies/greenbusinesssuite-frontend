import defaultMeshApi from "../defaultMeshClient";
import authApi from "../meshAuthClient";
import multipartMeshApi from "../multipartMeshClient";
import type { CompanyBrandingPayload } from "@/types";
import { extractFileUrl } from "@/hooks/useFileUpload";
import { compressImage } from "@/lib/imageCompression";

const MAX_BRANDING_LOGO_BYTES = 512 * 1024;

async function prepareBrandingLogo(file: File) {
  const prepared = await compressImage(file, {
    maxSize: 512,
    quality: 0.82,
    compressAboveBytes: 80 * 1024,
  });
  if (prepared.size > MAX_BRANDING_LOGO_BYTES) {
    throw new Error(
      "Logo is too large. Please use a JPG or PNG under 512KB."
    );
  }
  return prepared;
}

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

function isNotFound(error: any) {
  return error?.response?.status === 404 || error?.response?.status === 405;
}

/** GET /company-branding/{id} */
export const getCompanyBrandingById = (id: string | number) => {
  return () =>
    defaultMeshApi
      .get(`/company-branding/${id}`)
      .then((res) => res.data)
      .catch((error) => {
        if (isNotFound(error)) return null;
        throw error;
      });
};

/** GET /company-branding/find-by-tenancy-id/{tenancyId} */
export const getCompanyBrandingByTenancyId = (tenancyId: string) => {
  return () =>
    defaultMeshApi
      .get(`/company-branding/find-by-tenancy-id/${tenancyId}`)
      .then((res) => res.data)
      .catch((error) => {
        if (isNotFound(error)) return null;
        throw error;
      });
};

/** Backwards-compatible alias used across the app */
export const getCompanyBranding = getCompanyBrandingByTenancyId;

/** GET /company-branding/find-by-company-id/{companyId} */
export const getBrandingByCompanyId = (companyId: string | number) => {
  return () =>
    authApi
      .get(`/company-branding/find-by-company-id/${companyId}`)
      .then((res) => res.data)
      .catch((error) => {
        if (isNotFound(error)) return null;
        throw error;
      });
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
  file: File,
  tenancyId?: string | null
) => {
  const formData = new FormData();
  formData.append("file", file);
  return multipartMeshApi
    .post(`/company-branding/company/${companyId}/logo`, formData, {
      headers: tenancyId ? { tenantid: tenancyId } : undefined,
    })
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
    .post(`/company-branding/tenancy/${tenancyId}/logo`, formData, {
      headers: { tenantid: tenancyId },
    })
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

async function uploadViaS3(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const safeName = encodeURIComponent(file?.name ?? "logo.png");
  const data = await multipartMeshApi
    .post(`/s3/resource/upload/${safeName}`, formData)
    .then((res) => res.data);
  const url = extractFileUrl(data);
  if (!url) {
    throw new Error("Logo uploaded but no file URL was returned");
  }
  return url;
}

export const uploadBrandingLogo = async ({
  file,
}: {
  companyId?: string | number | null;
  tenancyId?: string | null;
  file: File;
}) => {
  // Production currently 404s on /company-branding/.../logo.
  // Upload the file to S3, then branding create/update stores the URL.
  const prepared = await prepareBrandingLogo(file);
  return uploadViaS3(prepared);
}

/** Delete branding logo via company id when available, otherwise tenancy id. */
export const deleteBrandingLogo = async ({
  companyId,
  tenancyId,
}: {
  companyId?: string | number | null;
  tenancyId?: string | null;
}) => {
  try {
    if (companyId != null && companyId !== "") {
      return await deleteBrandingLogoByCompanyId(companyId);
    }
    if (tenancyId) {
      return await deleteBrandingLogoByTenancyId(tenancyId);
    }
  } catch (error) {
    if (!isNotFound(error)) throw error;
    return null;
  }
  throw new Error("Company ID or tenancy ID is required to delete a logo");
};
