import React, { createContext, useEffect, useState } from "react";

export const FormContext = createContext();

// services and query
import services from "@/services";
import { useQueryClient } from "@tanstack/react-query";

//toast
import { toast } from "sonner";

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

  function isEmpty(obj) {
    if (obj !== null) {
      return Object.keys(obj).length === 0 && obj?.constructor === Object;
    }
  }

  // for syncing with the server

  useEffect(() => {
    if (!isEmpty(form)) {
      setForm((prev) => ({ ...prev, layout: formLayout }));
      // update remote form too
      updateRemoteForm({ ...form, layout: formLayout });
    }
  }, [formLayout]);

  // UPDATE REMOTE FORM FIRST
  const updateRemoteForm = (updatedForm) => {
    // only when there's an active form selected
    if (!isEmpty(form)) {
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
          // toast.error("Error occured");
          console.log("error updating remote form:", e);
        });
    }
  };

  // form stuff
  const selectForm = (data) => {
    setForm(data);
  };

  const updateIsTemplate = (isTemplate) => {
    setForm((prev) => ({ ...prev, isTemplate: isTemplate }));
    updateRemoteForm({ ...form, isTemplate: isTemplate });
  };

  const updateIsAnonymous = (isAnonymous) => {
    setForm((prev) => ({ ...prev, isAnonymous: isAnonymous }));
    updateRemoteForm({ ...form, isAnonymous: isAnonymous });
  };

  const updateActiveField = (section, data) => {
    if (!isEmpty(form)) {
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
              console.log("error getting updated form", e);
            });

          toast.dismiss();
        })
        .catch((e) => {
          toast.dismiss();
          // toast.error("Error occured");
          console.log("error updating remote form:", e);
        });
    }
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
  };

  // deadline
  const updateDeadline = (date) => {
    updateRemoteForm({
      ...form,
      deadline: new Date(date),
    });
  };

  const updateFormSectionsOrdering = (sections) => {
    //
    updateRemoteForm({
      ...form,
      formSections: [...sections],
    });
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

    // let tempFormSections = form?.formSections;

    // let indexSection = tempFormSections?.indexOf(data);

    // if (indexSection !== -1) {
    //   tempFormSections[indexSection] = {
    //     ...data,
    //     isDeleted: true,
    //     deletedOn: new Date(),
    //   };
    // }
    toast.loading("Deleting section...");
    services
      .deleteSection(data?.id)
      .then((res) => {
        toast.dismiss();
        toast.success("Section deleted");
        setLoadingSection(false);
        queryClient.invalidateQueries({
          queryKey: ["form", form?.id],
        });
        services
          .getFormByIdRaw(form?.id)
          .then((res) => {
            setForm(res?.data);
            setLoadingSection(false);
          })
          .catch((e) => {
            toast.error("Error occured retriving updated form");
            console.log("error getting form");
          });
      })
      .catch((e) => {
        toast.error("Error deleting form section");
        console.log("error deleting section", e);
        setLoadingSection(false);
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
        updateFormSectionsOrdering,
        selectForm,
        addFormSection,
        updateIsAnonymous,
        removeForm,
        addFormField,
        formLayout,
        setFormLayout,
        updateIsTemplate,
        updateDeadline,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};
