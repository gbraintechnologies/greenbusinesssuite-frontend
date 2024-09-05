import defaultMeshApi from "../defaultMeshClient";
import authApi from "../meshAuthClient";
import multipartMeshApi from "../multipartMeshClient";

export const allJurisdictions = (Page: number = 0, Size: number = 100) => {
  return () =>
    defaultMeshApi.get(`countries/all/${Page}/${Size}`).then((res) => res.data);
};

export const allcountries = () => {
  return () =>
    defaultMeshApi.get(`countries/names`).then((res) => res.data);
};

export const csvUploads = (formData: FormData, file: string) => {
  return multipartMeshApi.post(`countries/csv-import/${file}`, formData);
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
  return () => authApi.get(`/countries/by-id/${id}`).then((res) => res.data);
};
