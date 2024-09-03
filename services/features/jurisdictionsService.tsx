import defaultMeshApi from "../defaultMeshClient";
import authApi from "../meshAuthClient";
import multipartMeshApi from "../multipartMeshClient";

export const allJurisdictions = (
  page: number = 1,
  limit: number = 100,
  search: string = ""
) => {
  return () =>
    defaultMeshApi
      .get(`/jurisdictions/all?page=${page}&size=${limit}&search=${search}`)
      .then((res) => res.data);
};

export const csvUploads = (formData: FormData, file: string) => {
  return multipartMeshApi.post(`jurisdictions/csv/${file}`, formData);
};

export const createFreeInputJurisdiction = (data: any) => {
  return authApi.post("/jurisdictions/create-parent-address-scheme", data);
};

export const createParentDropdownJurisdiction = (data: any) => {
  return authApi.post(
    "/jurisdictions/create-parent-address-scheme/manual-entries",
    data
  );
};

export const getParentEntriesById = (id: number) => {
  return () =>
    authApi
      .get(`/jurisdictions/entries/parent-address/${id}`)
      .then((res) => res.data);
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

export const createChildEntriesID = (id: any, payload: any) => {
  return authApi.post(`/jurisdictions/create/${id}`, payload);
};

export const deleteJurisdictionByID = (id: any) => {
  return authApi.delete(`/jurisdictions/delete/${id}`);
};

export const deleteParentAddressAndChildByID = (
  parentAddressSchemeEntryID: any
) => {
  return authApi.delete(
    `/jurisdictions/parent-address-scheme-entry/delete/${parentAddressSchemeEntryID}`
  );
};

export const getJurisdictionEntriesById = (id: number) => {
  return () =>
    defaultMeshApi
      .get(`/jurisdictions/get-a-jurisdiction/with-entries/${id}`)
      .then((res) => res.data);
};

export const getJurisdictionEntriesByIdRaw = (id: number) => {
  return authApi
    .get(`/jurisdictions/get-a-jurisdiction/with-entries/${id}`)
    .then((res) => res.data);
};

export const editJurisdictionEntriesByID = (
  parentAddressSchemeID: number,
  data: any
) => {
  return authApi.put(
    `/jurisdictions/edit/parent-address-scheme-and-entries/${parentAddressSchemeID}`,
    data
  );
};

export const editParentSchemeChildEntriesByID = (id: number, data: any) => {
  return authApi.put(`/jurisdictions/edit/${id}`, data);
};

export const deleteParentAddressAndAssociatesByID = (
  parentAddressSchemeID: any
) => {
  return authApi.delete(
    `/jurisdictions/delete-parent-address-scheme/${parentAddressSchemeID}`
  );
};
