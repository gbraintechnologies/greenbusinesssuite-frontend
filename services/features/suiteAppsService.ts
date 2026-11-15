import authApi from "../axiosAuthClient";
import noAuthApi from "../axiosNoAuthClient";
import multipartMeshApi from "../multipartMeshClient";
import { extractFileUrl } from "@/hooks/useFileUpload";
import type { SuiteProduct } from "@/lib/suiteProducts";

export type SuiteAppDto = {
  id: number | string;
  name: string;
  tagline?: string | null;
  description?: string | null;
  href: string;
  category?: string | null;
  published?: boolean;
  logoUrl?: string | null;
  logo_url?: string | null;
  mark?: string | null;
  accent?: string | null;
  wash?: string | null;
  sortOrder?: number | null;
  sort_order?: number | null;
};

const ACCENTS = [
  { accent: "bg-[#14532d]", wash: "bg-[#f0fdf4]" },
  { accent: "bg-[#0b57d0]", wash: "bg-[#e8f0fe]" },
  { accent: "bg-[#0f766e]", wash: "bg-[#f0fdfa]" },
  { accent: "bg-[#9a3412]", wash: "bg-[#fff7ed]" },
  { accent: "bg-[#1e3a5f]", wash: "bg-[#eff6ff]" },
];

export function mapSuiteAppToProduct(
  raw: SuiteAppDto,
  index = 0
): SuiteProduct {
  const palette = ACCENTS[index % ACCENTS.length];
  const name = String(raw.name ?? "").trim() || "Untitled app";
  const logoUrl = String(raw.logoUrl ?? raw.logo_url ?? "").trim() || undefined;

  return {
    id: String(raw.id),
    name,
    tagline: String(raw.tagline ?? "").trim() || "Suite app",
    description:
      String(raw.description ?? "").trim() ||
      "Open this app from your customer portal.",
    href: String(raw.href ?? "").trim(),
    category: String(raw.category ?? "").trim() || "App",
    published: Boolean(raw.published),
    logoUrl,
    mark:
      String(raw.mark ?? name)
        .trim()
        .charAt(0)
        .toUpperCase() || "A",
    accent: String(raw.accent ?? "").trim() || palette.accent,
    wash: String(raw.wash ?? "").trim() || palette.wash,
    sortOrder: Number(raw.sortOrder ?? raw.sort_order ?? index) || index,
  };
}

export function listPublishedSuiteApps() {
  return noAuthApi
    .get<SuiteAppDto[]>("/suite-apps/published")
    .then((res) =>
      (Array.isArray(res.data) ? res.data : []).map(mapSuiteAppToProduct)
    );
}

export function listAllSuiteApps() {
  return authApi
    .get<SuiteAppDto[]>("/suite-apps")
    .then((res) =>
      (Array.isArray(res.data) ? res.data : []).map(mapSuiteAppToProduct)
    );
}

export function createSuiteApp(payload: Partial<SuiteProduct>) {
  return authApi
    .post<SuiteAppDto>("/suite-apps", toRequestBody(payload))
    .then((res) => mapSuiteAppToProduct(res.data));
}

export function updateSuiteApp(id: string | number, payload: Partial<SuiteProduct>) {
  return authApi
    .put<SuiteAppDto>(`/suite-apps/${id}`, toRequestBody(payload))
    .then((res) => mapSuiteAppToProduct(res.data));
}

export function deleteSuiteApp(id: string | number) {
  return authApi.delete(`/suite-apps/${id}`);
}

export async function uploadSuiteAppLogo(file: File) {
  const safeName = encodeURIComponent(file.name.replace(/\s+/g, "-"));
  const formData = new FormData();
  formData.append("file", file);
  const data = await multipartMeshApi
    .post(`/s3/resource/upload/${safeName}`, formData, { timeout: 120_000 })
    .then((res) => res.data);
  const url = extractFileUrl(data);
  if (!url) {
    throw new Error("Upload succeeded but no file URL was returned.");
  }
  return url;
}

function toRequestBody(payload: Partial<SuiteProduct>) {
  return {
    name: payload.name ?? "",
    tagline: payload.tagline ?? "",
    description: payload.description ?? "",
    href: payload.href ?? "",
    category: payload.category ?? "App",
    published: Boolean(payload.published),
    logoUrl: payload.logoUrl || null,
    mark: payload.mark ?? "A",
    accent: payload.accent ?? "bg-[#14532d]",
    wash: payload.wash ?? "bg-[#f0fdf4]",
    sortOrder: payload.sortOrder ?? 0,
  };
}
