import { TimelineType } from "@/types";
import authApi from "../meshAuthClient";
import defaultMeshApi from "../defaultMeshClient";

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

export const companyCustomersWithFormCount = (
  companyId: number,
  page: number,
  size: number,
  timeline: TimelineType = "ALL"
) => {
  return () =>
    authApi
      .get(
        `/forms/response/completed-forms-count/${companyId}/${page}/${size}/${timeline}`
      )
      .then((res) => res.data);
};

export const publishedFomsOfCompany = (companyId: number) => {
  return () =>
    defaultMeshApi
      .get(`/forms/builder/published-forms-ids/${companyId}`)
      .then((res) => res.data);
};

export const assignFormToCompany = (
  formId: number | string,
  companyId: string | number
) => {
  return authApi.put(`/forms/builder/company/${formId}/${companyId}`);
};

export const getFormById = (id: any) => {
  return () =>
    defaultMeshApi.get(`/forms/builder/${id}`).then((res) => res.data);
};

export const getFormByIdDefault = (id: any) => {
  return () =>
    defaultMeshApi.get(`/forms/builder/${id}`).then((res) => res.data);
};

export const getFormByIdRaw = (id: any) => {
  return defaultMeshApi.get(`/forms/builder/${id}`);
};

export const getFormByIdRawForUser = (id: any) => {
  return defaultMeshApi.get(`/forms/builder/${id}`);
};

export const getFormsByCompanyId = (
  companyId: string,
  page: string | number = 0,
  size: string | number,
  timeLine: TimelineType = "ALL"
) => {
  return () =>
    defaultMeshApi
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

export const getUserCompletedForms = (userId: string) => {
  return () =>
    authApi.get(`/forms/response/completed/${userId}`).then((res) => res.data);
};

export const getFormUserResponseById = (id: string) => {
  return () =>
    authApi.get(`/forms/response/user-data/${id}`).then((res) => res.data);
};

export const getFormUserResponseByIdWithPaymentDetails = (id: string) => {
  return () =>
    authApi
      .get(`/forms/response/user-data/with-pay-details/${id}`)
      .then((res) => res.data);
};

export const retrieveFormUserResponseRaw = (id: any) => {
  return authApi.get(`/forms/response/user-data/${id}`).then((res) => res.data);
};

export const getUserUncompletedForms = (userId: string) => {
  return () =>
    authApi
      .get(`/forms/response/uncompleted/${userId}`)
      .then((res) => res.data);
};

export const getAllUserFormResponses = (userId: string) => {
  return () =>
    authApi.get(`/forms/response/user/${userId}`).then((res) => res.data);
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

export const getUncompletedFormsByUserId = (
  page: string | number = 0,
  size: string | number = 20,
  timeline: TimelineType = "ALL",
  unCompletedFormIds: string | number = 0
) => {
  return () =>
    authApi
      .get(
        `/forms/builder/user/uncompleted-forms/${page}/${size}/${timeline}/${unCompletedFormIds}`
      )
      .then((res) => res.data);
};

export const getFormsByIds = (formIds: string) => {
  return () =>
    authApi
      .get(`/forms/builder/user-forms-by/${formIds}`)
      .then((res) => res.data);
};

export const getFormsByUserId = (userId: string | null) => {
  if (!userId) {
    throw new Error("User ID is required");
  }
  return () =>
    authApi.get(`/forms/response/user/${userId}`).then((res) => res.data);
};

export const getFormResponseById = (
  id: number,
  page: string | number = 0,
  size: string | number = 20,
  timeLine: TimelineType = "ALL"
) => {
  return () =>
    authApi
      .get(`/forms/response/data/${id}/${page}/${size}/${timeLine}`)
      .then((res) => res.data);
};

export const getFormResponsesById = (id: number) => {
  return authApi.get(`/forms/response/data/${id}/0/10000/ALL`);
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
  return defaultMeshApi.put(`/forms/builder/update`, data);
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
  return defaultMeshApi.put(`/forms/builder/publish/${id}`);
};

export const unpublishForm = (id: any) => {
  return defaultMeshApi.put(`/forms/builder/unpublish/by-id/${id}`);
};

export const deleteSection = (id: any) => {
  return authApi.delete(`/forms/builder/form-section/${id}`);
};

export const deleteForm = (id: any) => {
  return authApi.delete(`/forms/builder/soft-delete/${id}`);
};

// PUBLISH FORM

// API KEYS
export const regenerateAPIKey = (id: any) => {
  return authApi.put(`/forms/builder/generate/apikey/${id}`);
};

export const assignCompanyToForm = (
  formId: string | number,
  companyId: string | number
) => {
  return authApi.put(`/forms/builder/company/${formId}/${companyId}`);
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
    status: "PENDING",
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

export const deleteResponse = (formResponseId: number) => {
  return authApi.delete(`/forms/response/${formResponseId}`);
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
  companyId: number | string,
  formId: number | string
) => {
  if (userId === null) {
    throw new Error("No User Id");
  }
  return () =>
    authApi
      .get(`/forms/response/user-form/${userId}/${companyId}/${formId}`)
      .then((res) => res.data);
};

export const retrieveAnonymousFormResponse = (responseId: number | string) => {
  return () =>
    authApi
      .get(`/forms/response/user-data/${responseId}`)
      .then((res) => res.data);
};

/** PUT /forms/builder/form-field-ordering */
export const updateFormFieldOrdering = (data: any) => {
  return authApi.put(`/forms/builder/form-field-ordering`, data);
};

/** PUT /forms/builder/form-section-ordering */
export const updateFormSectionOrdering = (data: any) => {
  return authApi.put(`/forms/builder/form-section-ordering`, data);
};

/** PUT /forms/builder/undelete/{id} */
export const undeleteForm = (id: string | number) => {
  return authApi.put(`/forms/builder/undelete/${id}`);
};

/** PUT /forms/builder/unpublish/by-name/{formName} */
export const unpublishFormByName = (formName: string) => {
  return authApi.put(
    `/forms/builder/unpublish/by-name/${encodeURIComponent(formName)}`
  );
};

/** GET /forms/builder/recent/{page}/{size}/{timeline} */
export const getRecentForms = (
  page: number,
  size: number,
  timeline: string = "ALL"
) => {
  return () =>
    authApi
      .get(`/forms/builder/recent/${page}/${size}/${timeline}`)
      .then((res) => res.data);
};

/** GET /forms/builder/company/{companyId}/{page}/{size}/{timeline} */
export const getFormsByCompanyIdPaged = (
  companyId: string | number,
  page: number,
  size: number,
  timeline: string = "ALL"
) => {
  return () =>
    authApi
      .get(`/forms/builder/company/${companyId}/${page}/${size}/${timeline}`)
      .then((res) => res.data);
};

/** GET /forms/builder/user/completed-forms/{page}/{size}/{timeline}/{completedFormIds} */
export const getCompletedFormsByIds = (
  page: number,
  size: number,
  timeline: string,
  completedFormIds: string
) => {
  return () =>
    authApi
      .get(
        `/forms/builder/user/completed-forms/${page}/${size}/${timeline}/${completedFormIds}`
      )
      .then((res) => res.data);
};

/** GET /forms/response/all/{page}/{size}/{timeline} */
export const getAllFormResponses = (
  page: number,
  size: number,
  timeline: string = "ALL"
) => {
  return () =>
    authApi
      .get(`/forms/response/all/${page}/${size}/${timeline}`)
      .then((res) => res.data);
};

/** GET /forms/response/company-data/{companyId}/{page}/{size}/{timeline} */
export const getCompanyFormResponseData = (
  companyId: string | number,
  page: number,
  size: number,
  timeline: string = "ALL"
) => {
  return () =>
    authApi
      .get(
        `/forms/response/company-data/${companyId}/${page}/${size}/${timeline}`
      )
      .then((res) => res.data);
};

/** GET /forms/response/data/user-company/{userId}/{companyId} */
export const getFormResponsesByUserAndCompany = (
  userId: string | number,
  companyId: string | number
) => {
  return () =>
    authApi
      .get(`/forms/response/data/user-company/${userId}/${companyId}`)
      .then((res) => res.data);
};

/** GET /forms/response/form-processing-status/{companyId}/{status}/{page}/{size} */
export const getFormProcessingStatus = (
  companyId: string | number,
  status: string,
  page: number,
  size: number
) => {
  return () =>
    authApi
      .get(
        `/forms/response/form-processing-status/${companyId}/${status}/${page}/${size}`
      )
      .then((res) => res.data);
};

/** GET /forms/response/forms-status/stats */
export const getFormsStatusStats = () => {
  return () =>
    authApi.get(`/forms/response/forms-status/stats`).then((res) => res.data);
};
