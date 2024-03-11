import { ICompany } from "@/types";
import authApi from "../axiosAuthClient";

export const getAllCompanies = () => {
  return () => authApi.get("/companies/all_companies").then((res) => res.data);
};

export const createCompany = (data: ICompany) => {
  return authApi.post("/companies/create/", data).then((res) => res.data);
};
