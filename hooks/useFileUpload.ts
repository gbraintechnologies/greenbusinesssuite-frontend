import axios from "axios";
import { useState } from "react";

import { meshBaseURL } from "@/lib/api";
import {
  getSessionTenantID,
  getToken,
  getUserUUID,
} from "@/services/localService";

/**
 * Normalizes the many shapes the S3 upload endpoint can return into a URL string.
 * Handles: plain string, { file_url }, { fileUrl }, { url }, { data: {...} }.
 */
export function extractFileUrl(payload: any): string | null {
  if (!payload) return null;
  if (typeof payload === "string") {
    return isPersistableLogoUrl(payload) ? payload : null;
  }
  const candidate =
    payload.file_url ??
    payload.fileUrl ??
    payload.url ??
    payload.logo ??
    payload.logoUrl ??
    payload.logo_url ??
    payload.company_logo ??
    payload.location ??
    payload.Location ??
    payload?.data?.file_url ??
    payload?.data?.fileUrl ??
    payload?.data?.url ??
    payload?.data?.logo ??
    payload?.data?.logoUrl ??
    null;
  if (typeof candidate !== "string") return null;
  return isPersistableLogoUrl(candidate) ? candidate.trim() : null;
}

function isJunkLogoString(url: string) {
  const trimmed = url.trim();
  return (
    !trimmed ||
    trimmed === "null" ||
    trimmed === "undefined" ||
    trimmed === "[object Object]"
  );
}

/** Safe to show in the UI (includes temporary blob/data previews). */
export function isDisplayableLogoUrl(url?: string | null): boolean {
  if (!url || typeof url !== "string" || isJunkLogoString(url)) return false;
  const trimmed = url.trim();
  return (
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("data:") ||
    /^https?:\/\//i.test(trimmed) ||
    trimmed.startsWith("/")
  );
}

/** Safe to persist to the API (never blob/data or object junk). */
export function isPersistableLogoUrl(url?: string | null): boolean {
  if (!url || typeof url !== "string" || isJunkLogoString(url)) return false;
  const trimmed = url.trim();
  if (trimmed.startsWith("blob:") || trimmed.startsWith("data:")) {
    return false;
  }
  return /^https?:\/\//i.test(trimmed) || trimmed.startsWith("/");
}

const useFileUpload = () => {
  const [loadingFile, setLoadingFile] = useState(false);

  const handleFileUpload = async (file: File) => {
    try {
      setLoadingFile(true);

      const formData = new FormData();
      formData.append("file", file);

      // Encode the filename so spaces/special chars don't break the URL
      const safeName = encodeURIComponent(file?.name ?? "upload");

      const response = await axios({
        baseURL: meshBaseURL,
        url: `/s3/resource/upload/${safeName}`,
        method: "POST",
        data: formData,
        // Do not set Content-Type — browser must attach multipart boundary
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "user-uuid": getUserUUID(),
          tenantid: getSessionTenantID(),
        },
        timeout: 120_000,
      });

      return response.data;
    } catch (error) {
      console.error("File upload failed", error);
      return null;
    } finally {
      setLoadingFile(false);
    }
  };

  return { handleFileUpload, loadingFile };
};

export default useFileUpload;
