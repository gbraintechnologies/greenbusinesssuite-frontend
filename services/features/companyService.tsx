import { meshBaseURL } from "@/lib/api";
import { CompanyInfo, CustomField } from "@/types";
import axios from "axios";
import authApi from "../axiosAuthClient";
import noAuthApi from "../axiosNoAuthClient";
import { getToken, getUserUUID } from "../localService";

export const getAllCompanies = (offset: number = 0, limit: number = 50) => {
  return () =>
    authApi
      .get(`/companies?page=${offset}&size=${limit}`)
      .then((res) => res.data);
};

export const searchCompany = (searchTerm: string) => {
  return () => authApi.get(`/companies`).then((res) => res.data);
};

export const getCompanyById = (id: number) => {
  return () => authApi.get(`/companies/${id}`).then((res) => res.data);
};

export const getCompanyAssignedForms = (id: number) => {
  return () =>
    authApi
      .get(`/forms/builder/search-assign-forms/${id}/0/2000/ALL`)
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
  custom_fields?: CustomField[],
) => {
  return await authApi.put(`/companies/edit_with_custom_fields/${companyId}`, {
    company_data: data,
    custom_fields,
  });
};

export const editCompanySMSSenderIDWithCustomFields = async (
  companyId: number | undefined,
  data: CompanyInfo,
  custom_fields?: CustomField[],
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

export const assignAndCreateAdminWithTenantId = ({
  data,
  tenantId,
}: {
  data: any;
  tenantId: string;
}) => {
  const customAxios = axios.create({
    baseURL: meshBaseURL,
    headers: {
      "Content-Type": "application/json",
      "user-uuid": getUserUUID(),
      Authorization: `Bearer ${getToken()}`,
      tenantid: tenantId,
    },
  });

  return customAxios.put("/companies/admin", data);
};

export const getSupportStaffAssignedCompanies = (userId: any) => {
  return authApi.get(`/company/get_support_staff_assigned_companies/${userId}`);
};

// Company Branding — re-exported from brandingService for backwards compatibility
export {
  createCompanyBranding,
  editCompanyBranding,
  getCompanyBranding,
} from "./brandingService";

export const updateCompanyStatus = (data: { id: number; status: string }) => {
  return authApi.put("/companies/status", data);
};

export const filterCompaniesByStatus = (status: string) => {
  return () =>
    authApi.get(`/companies/filter/status?status=${status}`).then((res) => res.data);
};

export const getCompanyByName = (name: string) => {
  return () =>
    authApi
      .get(`/companies/get-company-by-name/${encodeURIComponent(name)}`)
      .then((res) => res.data);
};

/** Resolve a company record by its public identifier (tenancy slug). */
export const getCompanyByIdentifier = (identifier: string) => {
  return async () => {
    const matchIdentifier = (company: any) =>
      String(company?.companyIdentifier || company?.company_identifier || "")
        .toLowerCase() === identifier.toLowerCase();

    const extractList = (payload: any) =>
      Array.isArray(payload) ? payload : payload?.content ?? [];

    // Public/no-auth first — login pages often have no session token
    try {
      const res = await noAuthApi.get(`/companies?page=0&size=1000`);
      const found = extractList(res.data).find(matchIdentifier);
      if (found) return found;
    } catch {
      // continue
    }

    // Authenticated fallback (platform admin session in same browser)
    try {
      const res = await authApi.get(`/companies?page=0&size=1000`);
      const found = extractList(res.data).find(matchIdentifier);
      if (found) return found;
    } catch {
      // continue
    }

    return null;
  };
};

export const updateCompanyAssignedForms = (data: {
  id: number;
  assignedFormIds: number[];
}) => {
  return authApi.put("/companies/forms", data);
};
