import { Company, CompanyInfo, CompanyObject, CustomField } from "@/types";
import authApi from "../axiosAuthClient";
import meshApi from "../meshAuthClient";
import defaultMeshApi from "../defaultMeshClient";

export const getAllCompanies = (offset: number = 0, limit: number = 50) => {
  return () =>
    authApi
      .get(`/companies?page=${offset}&size=${limit}`)
      .then((res) => res.data);
};

export const getCompanyById = (id: number) => {
  return () => authApi.get(`/companies/${id}`).then((res) => res.data);
};

export const getCompanyAssignedForms = (id: number) => {
  return () =>
    authApi
      .get(`/forms/builder/search-assign-forms/${id}/1/2000/ALL`)
      .then((res) => res.data);
};

export const createCompany = ({ data }: { data: any }) => {
  return authApi.post("/companies/create", data);
};

export const editCompany = ({ data }: { data: any }) => {
  return authApi.put("/companies", data);
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

export const editCompanySMSSenderIDWithCustomFields = async (
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

// company Administration
export const assignAdminToCompany = (adminID: number, companyID: number) => {
  return authApi.put("/companies/admin", {
    id: companyID,
    newAdminUserId: adminID,
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
  companyName: string,
  moduleIds: string[],
  categorySpecificModuleIds: string[]
) => {
  return meshApi.post("/company-branding/create", {
    tenancyId: tenantId,
    companyId: companyId,
    logo: logo,
    color: color,
    companyName: companyName,
    moduleIds: moduleIds,
    categorySpecificModuleIds: categorySpecificModuleIds,
  });
};

//edit company branding by id
export const editCompanyBranding = (
  id: string | number,
  companyId: string | number,
  tenantId: string,
  logo: string,
  color: string,
  companyName: string,
  coreModuleIds: string[],
  categorySpecificModuleIds: string[]
) => {
  return defaultMeshApi.put(`/company-branding/update`, {
    // id: id,
    tenancyId: tenantId,
    companyId: companyId,
    logo: logo,
    color: color,
    companyName: companyName,
    moduleIds: coreModuleIds,
    categorySpecificModuleIds: categorySpecificModuleIds,
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
