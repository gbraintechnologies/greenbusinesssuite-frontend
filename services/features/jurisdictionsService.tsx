import defaultMeshApi from "../defaultMeshClient";
import authApi from "../meshAuthClient";
import multipartMeshApi from "../multipartMeshClient";

export const allJurisdictions = (Page: number = 0, Size: number = 100) => {
  return () =>
    defaultMeshApi.get(`countries/all/${Page}/${Size}`).then((res) => res.data);
};

export const allcountries = () => {
  return () => defaultMeshApi.get(`/countries/names`).then((res) => res.data);
};

export const csvUploads = (formData: FormData) => {
  return multipartMeshApi.post(`/countries/csv-import`, formData);
};

export const createCountry = (data: any) => {
  return authApi.post("/countries", data);
};

export const updateCountry = (data: any) => {
  return authApi.put(`/countries`, data);
};

export const deletecountryWithAssoc = (id: any) => {
  return authApi.delete(`/countries/delete/${id}`);
};

export const deleteparentLevel = (id: any) => {
  return authApi.delete(`/countries/delete-parent-level/${id}`);
};

export const getJurisdictionById = (id: number) => {
  return () =>
    defaultMeshApi.get(`/countries/by-id/${id}`).then((res) => res.data);
};

export const getJurisdictionByIdRaw = (id: number) => {
  return authApi.get(`/countries/by-id/${id}`).then((res) => res.data);
};

export const getCountryInfoByName = (countryName: string) => {
  return authApi.get(`/countries/name/${countryName}`).then((res) => res.data);
};

export const addParentLevel = (data: unknown) => {
  return authApi.put(`/countries/add-parent-level`, data);
};

export const getChildLevelsByParentName = (parentName: string) => {
  return () =>
    authApi
      .get(`/countries/child-levels/${parentName}`)
      .then((res) => res.data);
};

export const getChildEntriesByParentAndCountry = (
  parentName: string,
  countryId: string | number
) => {
  return () =>
    authApi
      .get(`/countries/child-entries/${parentName}/${countryId}`)
      .then((res) => res.data);
};
