"use client";
import { FormikHelpers } from "formik";
import React from "react";

import { toast } from "sonner";
import ModuleForm from "../../../components/ModuleForm";

const page = () => {
  const submitFn = (values: any, formikHelpers: FormikHelpers<any>): void => {
    const { setSubmitting } = formikHelpers;

    // Check if both fields are empty
    if (!values.companyAdminPortal && !values.clientPortal) {
      toast.error(
        "Please fill out at least one of the 'Company Admin Portal' or 'Client Portal' fields before submitting."
      );
      setSubmitting(false);
      return;
    }

    try {
      console.log("Submitting form with values:", values);
    } catch (error) {
      console.error("Error submitting form", error);
      toast.error("An error occurred. Please try again");
    } finally {
      setSubmitting(false);
    }
  };

  const initialValues = {
    moduleName: "Documents",
    // moduleType: "coreModule",
    companyAdminPortal: "",
    clientPortal: "",
  };
  return (
    <ModuleForm
      initialValues={initialValues}
      submitFn={submitFn}
      headerText="Edit Core Module"
    />
  );
};

export default page;
