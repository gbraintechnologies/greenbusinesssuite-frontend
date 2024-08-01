import { TimelineType } from "@/types";
import authApi from "../meshAuthClient";

export const allForms = (
  pageNumber: number,
  pageSize: number,
  timeLine: TimelineType = "ALL"
) => {
  return () =>
    authApi
      .get(`/forms/builder/all/${pageNumber}/${pageSize}/${timeLine}`)
      .then((res) => res.data);
};

// export const recentForms = (count: number) => {
//   return () =>
//     authApi.get(`/forms/builder/recent/1/10/ALL`).then((res) => res.data);
// };

export const allFormTemplates = (
  pageNumber: number,
  pageSize: number,
  timeLine: TimelineType = "ALL"
) => {
  return () =>
    authApi
      .get(
        `/forms/builder/list-templates/${pageNumber}/${pageSize}/${timeLine}`
      )
      .then((res) => res.data);
};

export const companyCustomersWithFormCount = (companyId: number) => {
  return () =>
    authApi
      .get(`/forms/response/completed-forms-count/${companyId}`)
      .then((res) => res.data);
};

export const assignFormToCompany = (
  formId: number | string,
  companyId: string
) => {
  return authApi.put(`/forms/builder/company/${formId}/${companyId}`);
};

export const getFormById = (id: any) => {
  return () => authApi.get(`/forms/builder/${id}`).then((res) => res.data);
};

export const getFormByIdRaw = (id: any) => {
  return authApi.get(`/forms/builder/${id}`);
};

export const getFormsByCompanyId = (
  companyId: string,
  page: string | number = 1,
  size: string | number = 20,
  timeLine: TimelineType = "ALL"
) => {
  return () =>
    authApi
      .get(
        `/forms/builder/search-assign-forms/${companyId}/${page}/${size}/${timeLine}`
      )
      .then((res) => res.data);
};

export const getFormStatisticsForUser = (userId: string | null) => {
  if (!userId) {
    throw new Error("No User Id");
  }
  return () =>
    authApi
      .get(`/forms/builder/user/form-statistics/${userId}`)
      .then((res) => res.data);
};

export const getCompletedFormsByUserId = (userId: string) => {
  return () =>
    authApi
      .get(`/forms/builder/user/completed-forms/${userId}`)
      .then((res) => res.data);
};

export const getUnassignedForms = (
  page: string | number = 1,
  size: string | number = 12,
  timeline: TimelineType = "ALL"
) => {
  return () =>
    authApi
      .get(`/forms/builder/unassigned-forms/${page}/${size}/${timeline}`)
      .then((res) => res.data);
};

export const getUncompletedFormsByUserId = (userId: string) => {
  return () =>
    authApi
      .get(`/forms/builder/user/uncompleted-forms/${userId}`)
      .then((res) => res.data);
};

export const getAllFormsByUserId = (userId: string) => {
  return () =>
    authApi.get(`/forms/builder/user-forms/${userId}`).then((res) => res.data);
};

export const getFormsByUserId = (userId: string | null) => {
  if (!userId) {
    throw new Error("User ID is required");
  }
  return () =>
    authApi.get(`/forms/builder/user-forms/${userId}`).then((res) => res.data);
};

export const getFormResponseById = (id: number) => {
  return () =>
    authApi.get(`/forms/response/data/${id}`).then((res) => res.data);
};

export const getFormResponsesById = (id: number) => {
  return authApi.get(`/forms/response/data/${id}`);
};

export const formResponseAnalytics = (id: number, companyId: string) => {
  return () =>
    authApi
      .get(`/forms/response/analytics/${id}/${companyId}`)
      .then((res) => res.data);
};

export const getFormStatusCountById = (id: number) => {
  return () =>
    authApi
      .get(`/forms/response/forms-status/count/${id}`)
      .then((res) => res.data);
};

export const publishedFormsCount = () => {
  return () =>
    authApi
      .get(`/forms/dashboard/published-forms/count`)
      .then((res) => res.data);
};

export const unpublishedFormsCount = () => {
  return () =>
    authApi
      .get("/forms/dashboard/unpublished-forms/count")
      .then((res) => res.data);
};

export const updateForm = (data: any) => {
  return authApi.put(`/forms/builder/update`, data);
};

export const updateFormField = (data: any) => {
  return authApi.put(`/forms/builder/field-update`, data);
};

export const renameForm = (id: any, name: string) => {
  return authApi.put(`/forms/builder/rename/${id}`, name);
};

export const createNewForm = (data: any) => {
  return authApi.post("/forms/builder/create", data);
};

export const duplicateForm = (id: any) => {
  return authApi.post(`/forms/builder/duplicateForm/${id}`);
};

export const publishForm = (id: any) => {
  return authApi.put(`/forms/builder/publish/${id}`);
};

export const unpublishForm = (id: any) => {
  return authApi.put(`/forms/builder/unpublish/by-id/${id}`);
};

export const deleteForm = (id: any) => {
  return authApi.delete(`/forms/builder/soft-delete/${id}`);
};

// PUBLISH FORM

// API KEYS
export const regenerateAPIKey = (id: any) => {
  return authApi.put(`/forms/builder/generate/apikey/${id}`);
};

export const assignCompanyToForm = (company: any, id: any) => {
  return authApi.post(`/forms/builder/${company}/duplicateForm`);
};

export const hardDeleteForm = (id: any) => {
  return authApi.delete(`/forms/builder/delete/${id}`);
};

export const deleteFormField = (id: any) => {
  return authApi.delete(`/forms/builder/formfield/${id}`);
};

export const hardDeleteUserForm = (userId: any, formId: any) => {
  return authApi.delete(`/forms/response/delete/${userId}/${formId}`);
};

// PUBLIC FORM ENDPOINTS
export const accessPublicPublishedForm = (id: any) => {
  return () =>
    authApi
      .get(`forms/builder/access-published-form/${id}`)
      .then((res) => res.data);
};

export const acceptInvite = (
  formId: any,
  userId: any,
  companyId: any,
  inputData: any
) => {
  return authApi.post(`forms/response/create`, {
    formId: parseInt(formId),
    isCompleted: false,
    inputData: inputData,
    companyId: companyId,
    userId: parseInt(userId),
  });
};

export const updateResponseStatus = (
  status: string,
  formResponseId: number
) => {
  return authApi.put(`forms/response/${status}/${formResponseId}`);
};

export const saveResponse = ({
  formId,
  userId,
  companyId,
  inputData,
  isCompleted,
  id,
}: any) => {
  return authApi.put(`forms/response/update`, {
    id: parseInt(id),
    formId: parseInt(formId),
    isCompleted: isCompleted,
    inputData: inputData,
    companyId: companyId,
    userId: parseInt(userId),
  });
};

export const retrieveFormUserResponses = (
  userId: number | string | null,
  formId: any
) => {
  if (userId === null) {
    throw new Error("No User Id");
  }

  return () =>
    authApi
      .get(`forms/response/data/user-form/${userId}/${formId}`)
      .then((res) => res.data);
};

export const retrieveFormUserResponseRaw = (
  userId: number | string | undefined | null,
  formId: number | string
) => {
  if (formId === undefined) {
    throw new Error("No Form Id");
  }
  return authApi
    .get(`forms/response/data/user-form/${userId}/${formId}`)
    .then((res) => res.data);
};
