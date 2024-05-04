import authApi from "../meshAuthClient";
import noAuthApi from "../axiosNoAuthClient";

export const allForms = () => {
  return () =>
    authApi.get("/forms/builder/all?page=0&size=2").then((res) => res.data);
};

export const allFormTemplates = () => {
  return () =>
    authApi.get("/forms/builder/list-templates").then((res) => res.data);
};

export const getFormById = (id: any) => {
  return () => authApi.get(`/forms/builder/${id}`).then((res) => res.data);
};

export const getFormByIdRaw = (id: any) => {
  return authApi.get(`/forms/builder/${id}`);
};

export const getFormsByCompanyName = (companyName: string) => {
  return () => authApi.get(`/forms/builder/company/${companyName}`);
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
  return authApi.post(`/forms/builder/${id}/duplicateForm`);
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

// PUBLIC FORM ENDPOINTS
export const accessPublicPublishedForm = (id: any) => {
  return () =>
    authApi
      .get(`forms/builder/access-published-form/${id}`)
      .then((res) => res.data);
};

export const acceptInvite = (formId: any, userId: any, companyName: any) => {
  return authApi.post(`forms/response/save`, {
    formId: formId,
    isCompleted: false,
    inputData: {},
    companyName: companyName,
    userId: userId,
  });
};
