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
