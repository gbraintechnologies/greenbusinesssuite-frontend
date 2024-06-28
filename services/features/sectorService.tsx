import authApi from "../meshAuthClient";

export const allSectors = () => {
  return () => authApi.get("/sectors").then((res) => res.data);
};

export const createSector = (data: any) => {
  return authApi.post("/sectors", data);
};

export const getSectorByCountry = (countryName: string) => {
  return () => authApi.get(`/sectors/info/${countryName}`).then((res) => res.data);
};

export const deleteSectorByID = (id: any) => {
  return authApi.delete(`/sectors/${id}`);
};

export const csvUpload = (formData: FormData ,fileName: string) => {
  return authApi.post(`/csv/sector/upload/${fileName}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
