import defaultMeshApi from "../defaultMeshClient";
import authApi from "../meshAuthClient";
import multipartMeshApi from "../multipartMeshClient";
import type { CompanyBrandingPayload } from "@/types";
import { extractFileUrl } from "@/hooks/useFileUpload";
import { compressImage } from "@/lib/imageCompression";
import { sanitizeS3UploadName } from "@/lib/s3UploadName";

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
  const safeName = sanitizeS3UploadName(file, "branding-logo");
  const formData = new FormData();
  formData.append("file", file, safeName);
  return multipartMeshApi
    .post(`/company-branding/company/${companyId}/logo`, formData, {
      headers: tenancyId ? { tenantid: tenancyId } : undefined,
      timeout: 120_000,
    })
    .then((res) => res.data);
};

/** POST /company-branding/tenancy/{tenancyId}/logo */
export const uploadBrandingLogoByTenancyId = (
  tenancyId: string,
  file: File
) => {
  const safeName = sanitizeS3UploadName(file, "branding-logo");
  const formData = new FormData();
  formData.append("file", file, safeName);
  return multipartMeshApi
    .post(`/company-branding/tenancy/${tenancyId}/logo`, formData, {
      headers: { tenantid: tenancyId },
      timeout: 120_000,
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
  const safeName = sanitizeS3UploadName(file, "branding-logo");
  const formData = new FormData();
  // Rename the multipart file so the backend doesn't use the WhatsApp name.
  formData.append("file", file, safeName);
  const data = await multipartMeshApi
    .post(`/s3/resource/upload/${safeName}`, formData, { timeout: 120_000 })
    .then((res) => res.data);
  const url = extractFileUrl(data);
  if (!url) {
    throw new Error("Logo uploaded but no file URL was returned");
  }
  return url;
}

function brandingLogoFromResponse(payload: any): string | null {
  return extractFileUrl(payload) || extractFileUrl(payload?.logo) || null;
}

/**
 * Prefer dedicated branding logo endpoints (they persist logo on the branding
 * record). Fall back to S3 + return a URL for create/update to store.
 * Always returns `{ logo: string, persistedOnServer?: boolean }` so callers
 * can extract a URL consistently.
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
  const prepared = await prepareBrandingLogo(file);

  // 1) Dedicated upload by company id
  if (companyId != null && companyId !== "") {
    try {
      const data = await uploadBrandingLogoByCompanyId(
        companyId,
        prepared,
        tenancyId
      );
      const logo = brandingLogoFromResponse(data);
      if (logo) {
        return { logo, persistedOnServer: true, branding: data };
      }
      // Server may have stored the file without returning a URL — treat as applied.
      return { logo: "", persistedOnServer: true, branding: data };
    } catch (error: any) {
      // 404/405/500 on dedicated logo routes → try next strategy
      const status = error?.response?.status;
      if (status && ![404, 405, 500, 501].includes(status)) {
        throw error;
      }
    }
  }

  // 2) Dedicated upload by tenancy id
  if (tenancyId) {
    try {
      const data = await uploadBrandingLogoByTenancyId(tenancyId, prepared);
      const logo = brandingLogoFromResponse(data);
      if (logo) {
        return { logo, persistedOnServer: true, branding: data };
      }
      return { logo: "", persistedOnServer: true, branding: data };
    } catch (error: any) {
      const status = error?.response?.status;
      if (status && ![404, 405, 500, 501].includes(status)) {
        throw error;
      }
    }
  }

  // 3) S3 fallback — caller must persist URL via branding create/update
  try {
    const logo = await uploadViaS3(prepared);
    return { logo, persistedOnServer: false };
  } catch (error: any) {
    const detail =
      error?.response?.data?.detail ||
      error?.response?.data?.message ||
      error?.message ||
      "Logo upload failed";
    throw new Error(
      typeof detail === "string"
        ? detail
        : "Logo upload failed. Please try a smaller JPG or PNG."
    );
  }
};

function isRetryableLogoDeleteError(error: any) {
  const status = error?.response?.status;
  // Dedicated logo DELETE is flaky in production (500/404/405).
  return status === 404 || status === 405 || status === 500 || status === 501;
}

/** Clear logo by updating branding record (works when DELETE /logo is broken). */
async function clearLogoViaBrandingUpdate({
  companyId,
  tenancyId,
  branding,
  color,
  companyName,
}: {
  companyId: string | number;
  tenancyId: string;
  branding?: any | null;
  color?: string;
  companyName?: string;
}) {
  const id = branding?.id ?? branding?.companyId ?? companyId;
  return editCompanyBranding(
    id,
    companyId,
    tenancyId,
    "",
    color || branding?.color || "",
    companyName || branding?.companyName || "",
    branding?.modules?.map((module: any) => module?.id) ??
      branding?.moduleIds ??
      [],
    branding?.categorySpecificModules?.map((module: any) => module?.id) ??
      branding?.categorySpecificModuleIds ??
      []
  );
}

/**
 * Delete branding logo.
 * Tries dedicated DELETE endpoints first; on backend 500/404 falls back to
 * clearing `logo` via PUT /company-branding/update.
 */
export const deleteBrandingLogo = async ({
  companyId,
  tenancyId,
  branding,
  color,
  companyName,
}: {
  companyId?: string | number | null;
  tenancyId?: string | null;
  branding?: any | null;
  color?: string;
  companyName?: string;
}) => {
  let lastError: any = null;

  if (companyId != null && companyId !== "") {
    try {
      return await deleteBrandingLogoByCompanyId(companyId);
    } catch (error) {
      lastError = error;
      if (!isRetryableLogoDeleteError(error)) throw error;
    }
  }

  if (tenancyId) {
    try {
      return await deleteBrandingLogoByTenancyId(tenancyId);
    } catch (error) {
      lastError = error;
      if (!isRetryableLogoDeleteError(error)) throw error;
    }
  }

  // Backend DELETE /logo currently 500s — clear logo field instead.
  if (companyId != null && companyId !== "" && tenancyId) {
    return clearLogoViaBrandingUpdate({
      companyId,
      tenancyId,
      branding,
      color,
      companyName,
    });
  }

  if (lastError) throw lastError;
  throw new Error("Company ID or tenancy ID is required to delete a logo");
};
