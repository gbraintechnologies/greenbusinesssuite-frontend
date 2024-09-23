import authApi from "../meshAuthClient";
import multipartMeshApi from "../multipartMeshClient";

export const allSectors = () => {
  return () => authApi.get("/sectors").then((res) => res.data);
};

export const allParentSectors = (pageNumber: number, pageSize: number) => {
  return () =>
    authApi
      .get(`/sectors/all/info-data/${pageNumber}/${pageSize}`)
      .then((res) => res.data);
};

export const createSector = (data: any) => {
  return authApi.post("/sectors/create", data);
};

export const getSectorByCountry = (countryName: string) => {
  return () => authApi.get(`/sectors/info/${countryName}`).then((res) => res.data);
};

export const getSectorByCountryRaw = (countryName: string) => {
  return authApi.get(`/sectors/info/${countryName}`).then((res) => res.data);
};

export const editSubsectorByID = (subSectorID: number, data: any) => {
  return authApi.put(`/sectors/edit/${subSectorID}`, data);
};

export const updateSector = (data: any) => {
  return authApi.put(`/sectors/update`, data);
};

export const deleteBySubSectorID = (subSectorID: any) => {
  return authApi.delete(`/sectors/delete/${subSectorID}`);
}; 

export const deleteBySectorID = (id: any) => {
  return authApi.delete(`/sectors/${id}`);
}; 

export const deleteAllSectors = (id: any) => {
  return authApi.delete(`/sectors/delete-all/${id}`);
}; 

export const getSectorByID = (sectorID: number) => {
  return () => authApi.get(`/sectors/data/${sectorID}`).then((res) => res.data);
}

export const getCountryByName = (countryName: string) => {
  return authApi.get(`/sectors/data-by-country/${countryName}`).then((res) => res.data);
};

export const getSectorByIDRaw = (sectorID: number) => {
  return authApi.get(`/sectors/data/${sectorID}`).then((res) => res.data);
}

export const getSubSectorByID = (sectorSetupID: number, SectorID: number | null) => {
  return () => authApi.get(`/sectors/details/${sectorSetupID}/${SectorID}`).then((res) => res.data);
};

export const getSubSectorByIdRaw = (sectorSetupId: number, sectorId: number) => {
  return authApi.get(`/sectors/details/${sectorSetupId}/${sectorId}`).then((res) => res.data);
}


export const csvUpload = (formData: FormData, fileName: string) => {
  return multipartMeshApi.post(`/csv/sector/upload/${fileName}`, formData);
};
