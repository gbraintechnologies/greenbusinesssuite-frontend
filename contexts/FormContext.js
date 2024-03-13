import React, { createContext, useEffect, useState } from "react";

// @ts-ignore
export const FormContext = createContext();

// @ts-ignore
const UserFromLS =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("form") || null)
    : null;

export const FormProvider = ({ children }) => {
  const [form, setForm] = useState(UserFromLS);
  const [view, setView] = useState("builder");
  const [formLayout, setFormLayout] = useState("classic");

  const selectForm = (data) => {
    setForm(data);
  };

  const removeForm = () => {
    setForm(null);
  };

  useEffect(() => {
    //
    localStorage.setItem("form", JSON.stringify(form));
  }, [form]);

  return (
    <FormContext.Provider
      value={{
        form,
        view,
        setView,
        selectForm,
        removeForm,
        formLayout,
        setFormLayout,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};
