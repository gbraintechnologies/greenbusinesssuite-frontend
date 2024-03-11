import authApi from "../axiosAuthClient";

export const getAllCompanies = () => {
  return () => authApi.get("/companies/all_companies").then((res) => res.data);
};
