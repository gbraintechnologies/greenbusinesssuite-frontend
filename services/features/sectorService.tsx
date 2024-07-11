import authApi from "../meshAuthClient";
import multipartMeshApi from "../multipartMeshClient";

export const allSectors = () => {
  return () => authApi.get("/sectors").then((res) => res.data);
};

export const createSector = (data: any) => {
  return authApi.post("/sectors", data);
};

export const getSectorByCountry = (countryName: string) => {
  return () => authApi.get(`/sectors/info/${countryName}`).then((res) => res.data);
};

export const editSubsectorByID = (subSectorID: number, data: any) => {
  return authApi.put(`/sectors/edit/${subSectorID}`, data);
};

export const deleteBySubSectorID = (subSectorID: any) => {
  return authApi.delete(`/sectors/delete/${subSectorID}`);
}; 

export const deleteBySectorID = (id: any) => {
  return authApi.delete(`/sectors/${id}`);
}; 

export const getSubSectorByID = (sectorSetupID: number, SectorID: number | null) => {
  return () => authApi.get(`/sectors/details/${sectorSetupID}/${SectorID}`).then((res) => res.data);
};


export const csvUpload = (formData: FormData, fileName: string) => {
  return multipartMeshApi.post(`/csv/sector/upload/${fileName}`, formData);
};
