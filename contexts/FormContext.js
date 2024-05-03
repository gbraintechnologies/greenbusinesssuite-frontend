import React, { createContext, useEffect, useState } from "react";

export const FormContext = createContext();

// services and query
import services from "@/services";
import { useQueryClient } from "@tanstack/react-query";

//toast
import toast from "react-hot-toast";

const UserFromLS =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("form") || null)
    : null;

export const FormProvider = ({ children }) => {
  const [form, setForm] = useState(UserFromLS);
  // view
  const [view, setView] = useState("builder");
  // layout
  const [formLayout, setFormLayout] = useState(form?.layout);

  // loaders for updates
  const [loadingSection, setLoadingSection] = useState(false);
  const [loadingField, setLoadingField] = useState(false);

  const [activeField, setActiveField] = useState(null);

  const queryClient = useQueryClient();

  // for syncing with the server

  useEffect(() => {
    if (form) {
      setForm((prev) => ({ ...prev, layout: formLayout }));
    }
  }, [formLayout]);

  // UPDATE REMOTE FORM FIRST
  const updateRemoteForm = (updatedForm) => {
    services
      .updateForm({ ...updatedForm, updatedOn: new Date() })
      .then((res) => {
        setForm(res.data);
        setLoadingField(false);
        setLoadingSection(false);
        queryClient.invalidateQueries({
          queryKey: ["form", form?.id],
        });
        toast.dismiss();
        // TODO: REMOVE AFTER TESTS
        // toast.success("updated remote");
      })
      .catch((e) => {
        toast.dismiss();
        toast.error("Error occured");
        console.log("error updating remote form:", e);
      });
  };

  // form stuff
  const selectForm = (data) => {
    setForm(data);
  };

  const updateActiveField = (section, data) => {
    // let allSections = form?.formSections;
    // let selectedSection = section;
    // let allFields = selectedSection?.formFields;
    // let selectedField = data;
    // let indexSection = allSections?.indexOf(selectedSection);
    // let indexField = allFields?.indexOf(
    //   allFields.find((element) => element.id == data.id)
    // );

    // // update selected field
    // if (indexField !== -1) {
    //   allFields[indexField] = selectedField;
    // }

    // // update section with fields
    // if (indexSection !== -1) {
    //   allSections[indexSection] = { ...section, formFields: allFields };
    // }

    services
      .updateFormField({ ...data, updatedOn: new Date() })
      .then((res) => {
        // setForm(res.data);
        setLoadingField(false);
        setLoadingSection(false);
        services
          .getFormByIdRaw(form.id)
          .then((res) => {
            setForm(res.data);
            queryClient.invalidateQueries({
              queryKey: ["form", form?.id],
            });
          })
          .catch((e) => {
            console.log("error getting updated form");
          });

        toast.dismiss();
        // TODO: REMOVE AFTER TESTS
        toast.success("updated field");
      })
      .catch((e) => {
        toast.dismiss();
        toast.error("Error occured");
        console.log("error updating remote form:", e);
      });

    // updateRemoteForm({ ...form, formSections: allSections });
  };

  const updateNameAndDescription = (data) => {
    updateRemoteForm({ ...form, ...data });
  };

  const removeForm = () => {
    setForm(null);
  };

  // sections
  const addFormSection = (data) => {
    setLoadingSection(true);
    updateRemoteForm({
      ...form,
      formSections: [
        ...form.formSections,
        { ordering: form.formSections.length, ...data },
      ],
    });
    // setForm((prev) => ({
    //   ...prev,
    //   formSections: [
    //     ...form.formSections,
    //     { ordering: form.formSections.length, ...data },
    //   ],
    // }));
  };

  const updateSection = (data) => {
    // setLoadingField(true);
    let sections = form?.formSections;
    //
    let tempSections = [];
    for (let i = 0; i < sections.length; i++) {
      //
      if (sections[i]?.id === data.id) {
        tempSections.push(data);
      } else {
        tempSections.push(sections[i]);
      }
    }

    // update form
    updateRemoteForm({
      ...form,
      formSections: tempSections,
    });
    // setForm((prev) => ({
    //   ...prev,
    //   formSections: tempSections,
    // }));
  };

  const removeSection = (data) => {
    setLoadingSection(true);

    let tempFormSections = form?.formSections;

    let indexSection = tempFormSections?.indexOf(data);

    if (indexSection !== -1) {
      tempFormSections[indexSection] = {
        ...data,
        isDeleted: true,
        deletedOn: new Date(),
      };
    }

    updateRemoteForm({
      ...form,
      formSections: [...tempFormSections],
    });
  };

  // fields
  const addFormField = (section, data) => {
    setLoadingField(true);
    let sections = form?.formSections;
    //
    let tempSections = [];
    for (let i = 0; i < sections.length; i++) {
      //
      if (sections[i]?.id === section.id) {
        // add new element to sections
        tempSections.push({
          ...section,
          formFields: [
            ...section?.formFields,
            { ...data, ordering: section?.formFields?.length },
          ],
        });
      } else {
        tempSections.push(sections[i]);
      }
    }

    // update form
    updateRemoteForm({
      ...form,
      formSections: tempSections,
    });
    // setForm((prev) => ({
    //   ...prev,
    //   formSections: tempSections,
    // }));
  };

  // update LS FORM
  useEffect(() => {
    localStorage.setItem("form", JSON.stringify(form));
  }, [form]);

  return (
    <FormContext.Provider
      value={{
        form,
        loadingField,
        loadingSection,
        updateNameAndDescription,
        removeSection,
        updateSection,
        activeField,
        setActiveField,
        updateActiveField,
        view,
        setView,
        selectForm,
        addFormSection,
        removeForm,
        addFormField,
        formLayout,
        setFormLayout,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};
