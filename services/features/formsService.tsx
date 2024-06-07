import authApi from "../meshAuthClient";

export const allForms = (pageNumber: number, pageSize: number) => {
  return () =>
    authApi
      .get(`/forms/builder/all/${pageNumber}/${pageSize}`)
      .then((res) => res.data);
};

export const recentForms = (count: number) => {
  return () =>
    authApi.get(`/forms/builder/recent/${count}`).then((res) => res.data);
};

export const allFormTemplates = () => {
  return () =>
    authApi.get("/forms/builder/list-templates").then((res) => res.data);
};

export const assignFormToCompany = (
  formId: number | string,
  companyName: string
) => {
  return authApi.put(`/forms/builder/company/${formId}/${companyName}`);
};

export const getFormById = (id: any) => {
  return () => authApi.get(`/forms/builder/${id}`).then((res) => res.data);
};

export const getFormByIdRaw = (id: any) => {
  return authApi.get(`/forms/builder/${id}`);
};

export const getFormsByCompanyName = (companyName: string) => {
  return () =>
    authApi
      .get(`/forms/builder/company/${companyName}`)
      .then((res) => res.data);
};

export const getFormStatisticsForUser = (userId: string) => {
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

export const getUnassignedForms = () => {
  return () =>
    authApi
      .get(`/forms/builder/unassigned-forms`)
      .then((res) => res.data);
}

export const getUncompletedFormsByUserId = (userId: string) => {
  return () =>
    authApi
      .get(`/forms/builder/user/uncompleted-forms/${userId}`)
      .then((res) => res.data);
};

export const getFormResponseById = (id: number) => {
  return () =>
    authApi.get(`/forms/response/data/${id}`).then((res) => res.data);
};

export const getFormResponsesById = (id: number) => {
  return authApi.get(`/forms/response/data/${id}`);
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
  return authApi.get(`/forms/builder/publish/${id}`);
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

// TODO: TEMP ENDPOINTS FOR DELETION
export const hardDeleteForm = (id: any) => {
  return authApi.delete(`/forms/builder/delete/${id}`);
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
  companyName: any,
  inputData: any
) => {
  return authApi.post(`forms/response/create`, {
    formId: formId,
    isCompleted: false,
    inputData: { data: inputData },
    companyName: companyName,
    userId: userId,
  });
};

export const saveResponse = ({
  formId,
  userId,
  companyName,
  inputData,
  isCompleted,
  responseId,
}: any) => {
  return authApi.put(`forms/response/update`, {
    id: parseInt(responseId),
    formId: parseInt(formId),
    isCompleted: isCompleted,
    inputData: inputData,
    companyName: companyName,
    userId: parseInt(userId),
  });
};

export const retrieveFormUserResponses = (userId: number, formId: any) => {
  return () =>
    authApi
      .get(`forms/response/data/user-form/${userId}/${formId}`)
      .then((res) => res.data);
};
