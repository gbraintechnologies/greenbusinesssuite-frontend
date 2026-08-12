import React, { createContext, useEffect, useState } from "react";

export const ClientPublicFormContext = createContext();

// services and query
import services from "@/services";
import { getPublicTenantID } from "@/services/localService";

//toast
import { toast } from "sonner";

//

const ClientFormFromLS =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("client-form-public") || null)
    : null;

export const ClientPublicFormProvider = ({ children }) => {
  // hold data in state for manipulation
  const [clientForm, setClientForm] = useState(ClientFormFromLS);

  const [savingResponses, setSavingResponses] = useState(false);

  const [filesToSubmit, setFilesToSubmit] = useState([]);

  const submitAndCompletePublicForm = async (userId) => {
    setSavingResponses(true);

    let data = clientForm;

    let formSections = [];

    for (let i = 0; i < data?.formSections?.length; i++) {
      let section = data?.formSections[i];

      if (section?.isDeleted) {
        // skip deleted form sections
        continue;
      }

      let formFields = [];
      for (let j = 0; j < section?.formFields?.length; j++) {
        let field = section?.formFields[j];
        if (Boolean(field?.formFieldId)) {
          formFields.push({
            response: field?.response ? field?.response : "",
            formFieldId: field?.formFieldId,
            fieldName: field?.name,
            isStatisticalField: field?.isStatisticalField
              ? field?.isStatisticalField
              : false,
            statisticalFunction: field?.statisticalFunction
              ? field?.statisticalFunction
              : "",
            displayType: field?.displayType ? field?.displayType : "",
          });
        }
      }
      formSections.push({
        formSectionId: section?.formSectionId,
        formDataFields: formFields,
      });
    }

    // submit responses
    let response = {
      formId: clientForm?.id,
      isCompleted: true,
      companyId: parseInt(clientForm?.companyId),
      status: "PENDING",
      inputData: {
        formSections: formSections,
      },
      updatedOn: new Date(),
      createdOn: new Date(),
    };

    //     {
    //   "id": 0,
    //   "formId": 0,
    //   "isCompleted": true,
    //   "companyId": 0,
    //   "userId": 0,
    //   "status": "PENDING",
    //   "inputData": {
    //     "id": 0,
    //     "formSections": [
    //       {
    //         "id": 0,
    //         "formSectionId": 0,
    //         "formDataFields": [
    //           {
    //             "id": 0,
    //             "formFieldId": 0,
    //             "fieldName": "string",
    //             "response": "string",
    //             "isStatisticalField": true,
    //             "statisticalFunction": "string",
    //             "displayType": "string",
    //             "statisticalField": true
    //           }
    //         ]
    //       }
    //     ]
    //   },
    //   "createdOn": "2025-02-10T15:06:37.485Z",
    //   "updatedOn": "2025-02-10T15:06:37.485Z"
    // }

    setSavingResponses(false);

    return services.submitPublicFormResponse(
      response,
      getPublicTenantID()
    );
  };

  const saveSingleResponse = (sectionId, fieldId, value) => {
    // find section, find field then add up value under response
    let sections = clientForm?.formSections;

    //
    let tempSections = [];
    for (let i = 0; i < sections.length; i++) {
      let section = sections[i];
      if (section?.isDeleted) {
        // skip deleted form sections
        continue;
      }

      if (sections[i]?.id === sectionId) {
        // FOUND SECTION SO FIND FIELD
        let tempFields = [];
        for (let j = 0; j < sections[i].formFields.length; j++) {
          if (sections[i].formFields[j]?.id === fieldId) {
            tempFields.push({ ...sections[i].formFields[j], response: value });
          } else {
            tempFields.push(sections[i].formFields[j]);
          }
        }

        // push to sections at end of inner loop
        tempSections.push({ ...sections[i], formFields: tempFields });
      } else {
        tempSections.push(sections[i]);
      }
    }

    // update form
    setClientForm({ ...clientForm, formSections: tempSections });
  };

  // remove client form
  const removeClientForm = () => {
    setClientForm(null);
  };

  // Set active form for data
  const selectClientForm = (data) => {
    setClientForm(data);
  };

  useEffect(() => {
    localStorage.setItem("client-public-form", JSON.stringify(clientForm));
  }, [clientForm]);

  return (
    <ClientPublicFormContext.Provider
      value={{
        clientForm,
        selectClientForm,
        removeClientForm,
        saveSingleResponse,
        savingResponses,
        setSavingResponses,
        submitAndCompletePublicForm,
        filesToSubmit,
        setFilesToSubmit,
      }}
    >
      {children}
    </ClientPublicFormContext.Provider>
  );
};
