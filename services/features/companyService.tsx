import { CompanyInfo, CompanyObject, CustomField } from "@/types";
import authApi from "../axiosAuthClient";

export const getAllCompanies = () => {
  return () => authApi.get("/companies/all_companies").then((res) => res.data);
};

export const createCompanyWithCustomFields = async (
  data: CompanyInfo,
  custom_fields: CustomField[]
) => {
  return await authApi
    .post("/companies/create_with_custom_fields/", {
      company_data: data,
      custom_fields,
    })
    .then((res) => res.data);
};

export const getCustomFields = () => {
  return authApi.get("/companies/get_custom_fields").then((res) => res.data);
};
