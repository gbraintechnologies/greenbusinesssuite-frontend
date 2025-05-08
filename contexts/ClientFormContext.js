import React, { createContext, useEffect, useState } from "react";

export const ClientFormContext = createContext();

// services and query
import services from "@/services";

//toast
import { toast } from "sonner";

//
import { useRouter } from "next/navigation";

const ClientFormFromLS =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("client-form") || null)
    : null;

export const ClientFormProvider = ({ children }) => {
  // hold data in state for manipulation
  const [clientForm, setClientForm] = useState(ClientFormFromLS);

  const [savingResponses, setSavingResponses] = useState(false);

  const [filesToSubmit, setFilesToSubmit] = useState([]);

  const router = useRouter();

  const storeUploadedFile = (acceptedFiles) => {
    //
    for (let file of acceptedFiles) {
      if (!filesToSubmit.some((f) => f === file)) {
        setFilesToSubmit((prev) => [...prev, file]);
      }
    }
  };

  const removeStoredFile = (file) => {
    setFilesToSubmit((prev) => [
      ...prev.filter((item) => item.name !== file.name),
    ]);
  };

  const saveResponsesRemote = (userId) => {
    setSavingResponses(true);

    let data = clientForm;

    let formSections = [];

    for (let i = 0; i < data?.formSections?.length; i++) {
      let section = data?.formSections[i];

      // SKIP DELETED SECTIONS
      if (section?.isDeleted) {
        // skip deleted form sections
        continue;
      }
      //

      let formFields = [];
      for (let j = 0; j < section?.formFields?.length; j++) {
        let field = section?.formFields[j];
        if (Boolean(field?.formFieldId)) {
          formFields.push({
            id: field?.id,
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
        id: section?.id,
        formSectionId: section?.formSectionId,
        formDataFields: formFields,
      });
    }

    let response = {
      id: clientForm?.responseId,
      formId: clientForm?.id,
      isCompleted: false,
      companyId: clientForm?.companyId,
      userId: userId,
      inputData: {
        id: clientForm?.responseId,
        formSections: formSections,
      },
      updatedOn: new Date(),
      createdOn: new Date(),
    };

    services
      .saveResponse(response)
      .then((res) => {
        toast.dismiss();
        setSavingResponses(false);

        toast.dismiss();
        toast.success("Saved responses!");

        setFilesToSubmit([]);
      })
      .catch((e) => {
        toast.dismiss();
        setSavingResponses(false);
        toast.error("Error saving responses. Please try again");
      });
  };

  const submitAndCompleteForm = async (userId) => {
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
        if (Boolean(field?.id)) {
          formFields.push({
            id: field?.id,
            response: field?.response ? field?.response : "",
            formFieldId: field?.id,
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
        id: section?.id,
        formSectionId: section?.id,
        formDataFields: formFields,
      });
    }

    // submit files if any
    for (const file of filesToSubmit) {
      const formData = new FormData();
      formData.append("file", file);
      // @ts-ignore
      let fileName = file?.name;
      let companyId = clientForm?.companyId;
      let formId = clientForm?.id;

      try {
        await services.uploadUserFile(
          userId,
          companyId,
          formId,
          formData,
          fileName
        );
        toast.success(`Submitted ${fileName} successfully!`);
      } catch (e) {
        toast.error(`Error submitting ${fileName}`);
      }
    }

    // submit responses
    let response = {
      id: clientForm?.responseId,
      formId: clientForm?.id,
      isCompleted: true,
      companyId: clientForm?.companyId,
      userId: userId,
      inputData: {
        id: clientForm?.responseId,
        formSections: formSections,
      },
      updatedOn: new Date(),
      createdOn: new Date(),
    };
    // Enum: PENDING, PROCESSING, COMPLETED;

    return services.saveResponse(response);
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
    localStorage.setItem("client-form", JSON.stringify(clientForm));
  }, [clientForm]);

  return (
    <ClientFormContext.Provider
      value={{
        clientForm,
        selectClientForm,
        removeClientForm,
        saveSingleResponse,
        saveResponsesRemote,
        savingResponses,
        setSavingResponses,
        submitAndCompleteForm,
        storeUploadedFile,
        removeStoredFile,
        filesToSubmit,
        setFilesToSubmit,
      }}
    >
      {children}
    </ClientFormContext.Provider>
  );
};
