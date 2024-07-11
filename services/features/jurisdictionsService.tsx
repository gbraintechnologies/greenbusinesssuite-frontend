import authApi from "../meshAuthClient";
import multipartMeshApi from "../multipartMeshClient";

export const allJurisdictions = () => {
  return () =>
    authApi.get("/jurisdictions/all").then((res) => res.data);
};

export const csvUploads = (formData: FormData, file: string) => {
  return multipartMeshApi.post(`jurisdictions/csv/${file}`, formData);
};

export const createFreeInputJurisdiction = (data: any) => {
  return authApi.post("/jurisdictions/create-parent-address-scheme", data);
};

export const createParentDropdownJurisdiction = (data: any) => {
  return authApi.post("/jurisdictions/create-parent-address-scheme/manual-entries", data);
};

export const getParentEntriesById = (id: number) => {
  return () =>
    authApi.get(`/jurisdictions/entries/parent-address/${id}`).then((res) => res.data);
};

export const getJurisdictionById = (id: number) => {
  return () =>
    authApi.get(`/jurisdictions/find-by/${id}`).then((res) => res.data);
};

export const updateJurisdictionByID = (id: number, data: any) => {
  return authApi.put(`/sectors/edit/${id}`, data);
};

export const createChildEntries = (data: any) => {
  return authApi.post(
    "/jurisdictions/create-child/address-scheme/with-entries",
    data
  );
};

export const deleteJurisdictionByID = (id: any) => {
  return authApi.delete(`/jurisdictions/delete/${id}`);
};

export const deleteParentAddressAndChildByID = (parentAddressSchemeEntryID: any) => {
  return authApi.delete(`/jurisdictions/parent-address-scheme-entry/delete/${parentAddressSchemeEntryID}`);
};

export const getJurisdictionEntriesById = (id: number) => {
  return () =>
    authApi.get(`/jurisdictions/get-a-jurisdiction/with-entries/${id}`).then((res) => res.data);
};

export const editJurisdictionEntriesByID = (parentAddressSchemeID: number, data: any) => {
  return authApi.patch(`/jurisdictions/edit/parent-address-scheme-and-entries/${parentAddressSchemeID}`, data);
};

export const deleteParentAddressAndAssociatesByID = (parentAddressSchemeID: any) => {
  return authApi.delete(`/jurisdictions/delete-parent-address-scheme/${parentAddressSchemeID}`);
};


