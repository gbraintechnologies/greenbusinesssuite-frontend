import authApi from "../meshAuthClient";
import multipartMeshApi from "../multipartMeshClient";


export const allcountries = (Page: number, Size: number) => {
    return () =>
        authApi
            .get(`countries/all/${Page}/${Size}`)
            .then((res) => res.data);
};

export const countryUpload = (formData: FormData, file: string) => {
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

export const getcountryByID = (id: number) => {
    return () => authApi.get(`/countries/by-id/${id}`).then((res) => res.data);
};