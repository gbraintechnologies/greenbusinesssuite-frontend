import React, { createContext, useEffect, useState } from "react";

export const ClientFormContext = createContext();

// services and query
import services from "@/services";
import { useQueryClient } from "@tanstack/react-query";

//toast
import toast from "react-hot-toast";

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

  const router = useRouter();

  const saveResponsesRemote = (userId) => {
    setSavingResponses(true);

    services
      .saveResponse({
        formId: clientForm?.id,
        responseId: clientForm?.responseId,
        isCompleted: false,
        inputData: {
          data: {
            formSections: clientForm?.formSections,
            layout: clientForm?.layout,
          },
        },
        companyName: clientForm?.companyName,
        userId: userId,
      })
      .then((res) => {
        toast.dismiss();
        setSavingResponses(false);

        toast.dismiss();
        toast.success("Saved responses!");
        router.push("/client");
      })
      .catch((e) => {
        toast.dismiss();
        setSavingResponses(false);
        toast.error("Error saving responses. Please try again");
      });
  };

  const submitAndCompleteForm = (userId) => {
    setSavingResponses(true);
    return services.saveResponse({
      formId: clientForm?.id,
      responseId: clientForm?.responseId,
      isCompleted: false,
      inputData: {
        data: {
          formSections: clientForm?.formSections,
          layout: clientForm?.layout,
        },
      },
      companyName: clientForm?.companyName,
      userId: userId,
    });
  };

  const saveSingleResponse = (sectionId, fieldId, value) => {
    // find section, find field then add up value under response
    let sections = clientForm?.formSections;
    //
    let tempSections = [];
    for (let i = 0; i < sections.length; i++) {
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

  // const updateActiveField = (section, data) => {
  //   services
  //     .updateFormField({ ...data, updatedOn: new Date() })
  //     .then((res) => {
  //       // setForm(res.data);
  //       setLoadingField(false);
  //       setLoadingSection(false);
  //       services
  //         .getFormByIdRaw(form.id)
  //         .then((res) => {
  //           setForm(res.data);
  //           queryClient.invalidateQueries({
  //             queryKey: ["form", form?.id],
  //           });
  //         })
  //         .catch((e) => {
  //           console.log("error getting updated form");
  //         });

  //       toast.dismiss();
  //       // TODO: REMOVE AFTER TESTS
  //       // toast.success("updated field");
  //     })
  //     .catch((e) => {
  //       toast.dismiss();
  //       toast.error("Error occured");
  //       console.log("error updating remote form:", e);
  //     });

  //   // updateRemoteForm({ ...form, formSections: allSections });
  // };

  // const updateNameAndDescription = (data) => {
  //   updateRemoteForm({ ...form, ...data });
  // };

  // const removeForm = () => {
  //   setForm(null);
  // };

  // // sections
  // const addFormSection = (data) => {
  //   setLoadingSection(true);
  //   updateRemoteForm({
  //     ...form,
  //     formSections: [
  //       ...form.formSections,
  //       { ordering: form.formSections.length, ...data },
  //     ],
  //   });
  //   // setForm((prev) => ({
  //   //   ...prev,
  //   //   formSections: [
  //   //     ...form.formSections,
  //   //     { ordering: form.formSections.length, ...data },
  //   //   ],
  //   // }));
  // };

  // const updateSection = (data) => {
  //   // setLoadingField(true);
  //   let sections = form?.formSections;
  //   //
  //   let tempSections = [];
  //   for (let i = 0; i < sections.length; i++) {
  //     //
  //     if (sections[i]?.id === data.id) {
  //       tempSections.push(data);
  //     } else {
  //       tempSections.push(sections[i]);
  //     }
  //   }

  //   // update form
  //   updateRemoteForm({
  //     ...form,
  //     formSections: tempSections,
  //   });
  //   // setForm((prev) => ({
  //   //   ...prev,
  //   //   formSections: tempSections,
  //   // }));
  // };

  // const removeSection = (data) => {
  //   setLoadingSection(true);

  //   let tempFormSections = form?.formSections;

  //   let indexSection = tempFormSections?.indexOf(data);

  //   if (indexSection !== -1) {
  //     tempFormSections[indexSection] = {
  //       ...data,
  //       isDeleted: true,
  //       deletedOn: new Date(),
  //     };
  //   }

  //   updateRemoteForm({
  //     ...form,
  //     formSections: [...tempFormSections],
  //   });
  // };

  // // fields
  // const addFormField = (section, data) => {
  //   setLoadingField(true);
  //   let sections = form?.formSections;
  //   //
  //   let tempSections = [];
  //   for (let i = 0; i < sections.length; i++) {
  //     //
  //     if (sections[i]?.id === section.id) {
  //       // add new element to sections
  //       tempSections.push({
  //         ...section,
  //         formFields: [
  //           ...section?.formFields,
  //           { ...data, ordering: section?.formFields?.length },
  //         ],
  //       });
  //     } else {
  //       tempSections.push(sections[i]);
  //     }
  //   }

  //   // update form
  //   updateRemoteForm({
  //     ...form,
  //     formSections: tempSections,
  //   });
  //   // setForm((prev) => ({
  //   //   ...prev,
  //   //   formSections: tempSections,
  //   // }));
  // };

  // update LS FORM
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
      }}
    >
      {children}
    </ClientFormContext.Provider>
  );
};
