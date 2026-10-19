import axios from "axios";
import { useState } from "react";

import { meshBaseURL } from "@/lib/api";
import { sanitizeS3UploadName } from "@/lib/s3UploadName";
import {
  getSessionTenantID,
  getToken,
  getUserUUID,
} from "@/services/localService";

/**
 * Normalizes the many shapes the S3 upload endpoint can return into a URL string.
 * Handles: plain string, { file_url }, { fileUrl }, { url }, { data: {...} }.
 */
function pickUrlCandidate(value: unknown): string | null {
  if (typeof value === "string") {
    return isPersistableLogoUrl(value) ? value.trim() : null;
  }
  return null;
}

export function extractFileUrl(payload: any): string | null {
  if (!payload) return null;
  const direct = pickUrlCandidate(payload);
  if (direct) return direct;
  if (typeof payload !== "object") return null;

  const keys = [
    "file_url",
    "fileUrl",
    "url",
    "logo",
    "logoUrl",
    "logo_url",
    "company_logo",
    "companyLogo",
    "location",
    "Location",
    "path",
    "filePath",
  ];

  for (const key of keys) {
    const found = pickUrlCandidate(payload[key]);
    if (found) return found;
  }

  // Dedicated branding logo upload returns the full branding object
  if (payload.branding) {
    const nested = extractFileUrl(payload.branding);
    if (nested) return nested;
  }
  if (payload.data) {
    const nested = extractFileUrl(payload.data);
    if (nested) return nested;
  }
  if (payload.result) {
    const nested = extractFileUrl(payload.result);
    if (nested) return nested;
  }

  return null;
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

      const safeName = sanitizeS3UploadName(file, "file");
      const formData = new FormData();
      formData.append("file", file, safeName);

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
