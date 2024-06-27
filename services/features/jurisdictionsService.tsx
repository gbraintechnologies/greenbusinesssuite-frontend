import authApi from "../meshAuthClient";

export const allJurisdictions = () => {
  return () => authApi.get("/jurisdictions/list-jurisdictions").then((res) => res.data);
};

export const createFreeInputJurisdiction = (data: any) => {
  return authApi.post("/jurisdictions/create-parent-address-scheme", data);
};

export const createParentDropdownJurisdiction = (data: any) => {
  return authApi.post("/jurisdictions/create-parent-address-scheme-with-manual-entries", data);
};

export const getParentEntriesById = (id: number) => {
  return () => authApi.get(`/jurisdictions/${id}/entries`).then((res) => res.data);
};

export const createChildEntries = (data: any) => {
  return authApi.post("/jurisdictions/create-child-address-scheme-with-entries", data);
};
