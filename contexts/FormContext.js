import React, { createContext, useEffect, useState } from "react";

export const FormContext = createContext();

const UserFromLS =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("form") || null)
    : null;

export const FormProvider = ({ children }) => {
  const [form, setForm] = useState(UserFromLS);
  const [view, setView] = useState("builder");

  // for syncing with the server
  const [triggerRemoteUpdate, setTriggerRemoteUpdate] = useState(false);

  // layout
  const [formLayout, setFormLayout] = useState(form?.layout);
  useEffect(() => {
    if (form) {
      setForm((prev) => ({ ...prev, layout: formLayout }));
    }
  }, [formLayout]);

  // form stuff
  const selectForm = (data) => {
    setForm(data);
  };

  const updateNameAndDescription = (data) => {
    setForm((prev) => ({ ...prev, ...data }));
    setTriggerRemoteUpdate(!triggerRemoteUpdate);
  };

  const removeForm = () => {
    setForm(null);
  };

  // sections
  const addFormSection = (data) => {
    setForm((prev) => ({
      ...prev,
      formSections: [
        ...form.formSections,
        { ordering: form.formSections.length, ...data },
      ],
    }));

    // update remote
    setTriggerRemoteUpdate(!triggerRemoteUpdate);
  };

  const updateSection = (data) => {
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
    setForm((prev) => ({
      ...prev,
      formSections: tempSections,
    }));

    // update remote
    setTriggerRemoteUpdate(!triggerRemoteUpdate);
  };

  const removeSection = (data) => {
    //
    setForm((prev) => ({
      ...prev,
      formSections: [
        ...form.formSections.filter((item) => item.id !== data.id),
      ],
    }));
    // update remote
    setTriggerRemoteUpdate(!triggerRemoteUpdate);
  };

  // fields

  useEffect(() => {
    //
    localStorage.setItem("form", JSON.stringify(form));
  }, [form]);

  return (
    <FormContext.Provider
      value={{
        form,
        updateNameAndDescription,
        removeSection,
        updateSection,
        view,
        setView,
        selectForm,
        addFormSection,
        triggerRemoteUpdate,
        removeForm,
        formLayout,
        setFormLayout,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};
