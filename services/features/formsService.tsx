import authApi from "../meshAuthClient";

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

export const publishForm = (data: any) => {
  let sampleData = {
    id: 0,
    name: "string",
    url: "string",
    description: "string",
    formInstruction: "string",
    formSections: [
      {
        id: 0,
        name: "string",
        description: "string",
        instruction: "string",
        form: {
          id: 0,
          name: "string",
          url: "string",
          description: "string",
          formInstruction: "string",
          formSections: [
            {
              id: 0,
              name: "string",
              description: "string",
              instruction: "string",
              form: "string",
              formFields: [
                {
                  id: 0,
                  name: "string",
                  description: "string",
                  formSection: "string",
                  instruction: "string",
                  ordering: 0,
                  isDeleted: true,
                  fieldDataType: "string",
                  choiceValues: ["string"],
                  isMandatory: true,
                  createdOn: "2024-03-13T14:30:34.351Z",
                  updatedOn: "2024-03-13T14:30:34.351Z",
                  deletedOn: "2024-03-13T14:30:34.351Z",
                },
              ],
              ordering: 0,
              isDeleted: true,
              createdOn: "2024-03-13T14:30:34.351Z",
              updatedOn: "2024-03-13T14:30:34.351Z",
              deletedOn: "2024-03-13T14:30:34.351Z",
            },
          ],
          userMandatory: true,
          deadline: "2024-03-13T14:30:34.351Z",
          publishStatus: "DRAFT",
          isDeleted: true,
          createdOn: "2024-03-13T14:30:34.351Z",
          updatedOn: "2024-03-13T14:30:34.351Z",
          deletedOn: "2024-03-13T14:30:34.351Z",
        },
        formFields: [
          {
            id: 0,
            name: "string",
            description: "string",
            formSection: {
              id: 0,
              name: "string",
              description: "string",
              instruction: "string",
              form: "string",
              formFields: [
                {
                  id: 0,
                  name: "string",
                  description: "string",
                  formSection: "string",
                  instruction: "string",
                  ordering: 0,
                  isDeleted: true,
                  fieldDataType: "string",
                  choiceValues: ["string"],
                  isMandatory: true,
                  createdOn: "2024-03-13T14:30:34.351Z",
                  updatedOn: "2024-03-13T14:30:34.351Z",
                  deletedOn: "2024-03-13T14:30:34.351Z",
                },
              ],
              ordering: 0,
              isDeleted: true,
              createdOn: "2024-03-13T14:30:34.351Z",
              updatedOn: "2024-03-13T14:30:34.351Z",
              deletedOn: "2024-03-13T14:30:34.351Z",
            },
            instruction: "string",
            ordering: 0,
            isDeleted: true,
            fieldDataType: "string",
            choiceValues: ["string"],
            isMandatory: true,
            createdOn: "2024-03-13T14:30:34.351Z",
            updatedOn: "2024-03-13T14:30:34.351Z",
            deletedOn: "2024-03-13T14:30:34.351Z",
          },
        ],
        ordering: 0,
        isDeleted: true,
        createdOn: "2024-03-13T14:30:34.351Z",
        updatedOn: "2024-03-13T14:30:34.351Z",
        deletedOn: "2024-03-13T14:30:34.351Z",
      },
    ],
    userMandatory: true,
    deadline: "2024-03-13T14:30:34.351Z",
    publishStatus: "DRAFT",
    isDeleted: true,
    createdOn: "2024-03-13T14:30:34.351Z",
    updatedOn: "2024-03-13T14:30:34.351Z",
    deletedOn: "2024-03-13T14:30:34.351Z",
  };
  return authApi.post("/forms/publish", data);
};

export const unpublishForm = (id: any) => {
  return authApi.put(`/forms/builder/unpublish/${id}`);
};

export const deleteForm = (id: any) => {
  return authApi.delete(`/forms/builder/soft-delete/${id}`);
};

// API KEYS
export const regenerateAPIKey = (id: any) => {
  return authApi.put(`/forms/builder/generate/apikey/${id}`);
};

export const assignCompanyToForm = (company: any, id: any) => {
  return authApi.post(`/forms/builder/${company}/duplicateForm`);
};

// BUILDER ENDPOINTS
