import { CompanyInfo, CompanyObject, CustomField } from "@/types";
import authApi from "../axiosAuthClient";

export const getAllCompanies = () => {
  return () => authApi.get("/companies/all_companies").then((res) => res.data);
};

export const getCompanyById = (id: number) => {
  return () => authApi.get(`/companies-by-id/${id}`).then((res) => res.data);
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

export const editCompanyWithCustomFields = async (
  companyId: number | undefined,
  data: CompanyInfo,
  custom_fields?: CustomField[]
) => {
  return await authApi.put(`/companies/edit_with_custom_fields/${companyId}`, {
    company_data: data,
    custom_fields,
  });
};

export const getCustomFields = () => {
  return authApi.get("/companies/get_custom_fields").then((res) => res.data);
};

export const searchCompany = (searchTerm: string) => {
  return () =>
    authApi.get(`/companies-by-filter/${searchTerm}`).then((res) => res.data);
};

// company Administration
export const assignAdminToCompany = (adminID: number, companyID: number) => {
  return authApi.put("/company/assign_admin_to_company", {
    company_admin_id: adminID,
    company_id: companyID,
  });
};

export const getSupportStaffAssignedCompanies = (userId: any) => {
  return authApi.get(`/company/get_support_staff_assigned_companies/${userId}`);
};
