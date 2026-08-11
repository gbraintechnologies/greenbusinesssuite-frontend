import defaultMeshApi from "../defaultMeshClient";
import authApi from "../meshAuthClient";

export const uniqueUsersCount = (companyId: number) => {
  return () =>
    authApi
      .get(`/forms/response/unique-users/count/${companyId}`)
      .then((res) => res.data);
};

export const totalEntries = (companyId: number) => {
  return () =>
    authApi
      .get(`/forms/response/total-entries/${companyId}`)
      .then((res) => res.data);
};

export const companyFormStats = (companyId: number) => {
  return () =>
    authApi
      .get(`/forms/response/total-forms/${companyId}`)
      .then((res) => res.data);
};

export const linksOpened = (companyId: number, publishedIds: string) => {
  return () =>
    authApi
      .get(`/forms/response/opened-links/${companyId}/${publishedIds}`)
      .then((res) => normalizeCount(res.data));
};

export const ignoredLinks = (companyId: number, publishedIds: string) => {
  return () =>
    authApi
      .get(`/forms/response/ignored-links/${companyId}/${publishedIds}`)
      .then((res) => normalizeCount(res.data));
};

function normalizeCount(data: unknown): number {
  if (data == null) return 0;
  if (typeof data === "number") return Number.isFinite(data) ? data : 0;
  if (typeof data === "string" && data.trim() !== "") {
    const n = Number(data);
    return Number.isFinite(n) ? n : 0;
  }
  if (typeof data === "object") {
    const record = data as Record<string, unknown>;
    const candidate =
      record.count ?? record.total ?? record.value ?? record.data;
    if (candidate !== data) return normalizeCount(candidate);
  }
  return 0;
}
