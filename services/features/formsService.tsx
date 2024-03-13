import authApi from "../meshAuthClient";

export const allForms = () => {
  return () => authApi.get("/forms/all").then((res) => res.data);
};

export const getFormById = (id: any) => {
  return () => authApi.get(`/forms/${id}`).then((res) => res.data);
};

export const updateForm = (id: any, data: any) => {
  return authApi.put(`/forms/update/${id}`, data);
};

export const createNewForm = (data: any) => {
  return authApi.post("/forms/create", data);
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
  return authApi.put(`/forms/unpublish/${id}`);
};

export const deleteForm = (id: any) => {
  return authApi.delete(`/forms/soft-delete/${id}`);
};
