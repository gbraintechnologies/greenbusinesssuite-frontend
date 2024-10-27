import { CompanyInfo, CompanyObject, CustomField } from "@/types";
import authApi from "../axiosAuthClient";
import meshApi from "../meshAuthClient";
import meshNoAuthApi from "../meshNoAuthClient";
import defaultMeshApi from "../defaultMeshClient";

export const getAllCompanies = (offset: number = 0, limit: number = 20) => {
  return () =>
    authApi
      .get(`/companies/all_companies?offset=${offset}&limit=${limit}`)
      .then((res) => res.data);
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

export const getCustomFieldsForCompany = (companyId: number) => {
  return () =>
    authApi
      .post(`/companies/fetch_company_custom_field/`, {
        company_id: companyId,
        custom_profile_item_id: 0,
      })
      .then((res) => res.data);
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

// Company Branding
// create company branding
export const createCompanyBranding = (
  companyId: string | number,
  tenantId: string,
  logo: string,
  color: string,
  companyName: string
) => {
  return meshApi.post("/company-branding/create", {
    tenancyId: tenantId,
    companyId: companyId,
    logo: logo,
    color: color,
    companyName: companyName,
  });
};

//edit company branding by id
export const editCompanyBranding = (
  companyId: string | number,
  tenantId: string,
  logo: string,
  color: string,
  companyName: string
) => {
  return defaultMeshApi.put(`/company-branding/update/${tenantId}`, {
    tenancyId: tenantId,
    companyId: companyId,
    logo: logo,
    color: color,
    companyName: companyName,
  });
};

//get company branding by tenant id
export const getCompanyBranding = (tenantId: string) => {
  return () =>
    defaultMeshApi
      .get(`/company-branding/find-by-tenancy-id/${tenantId}`)
      .then((res) => res.data);
  // return () => meshApi.get(`/company-branding/find-by-tenancy-id/${tenantId}`).then((res) => res.data);
};
