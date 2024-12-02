"use client";
import { FormikHelpers } from "formik";
import React from "react";

import { toast } from "sonner";
import ModuleForm from "../../../components/ModuleForm";

const page = () => {
  // states for handling form submission
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  const submitFn = (values: any, formikHelpers: FormikHelpers<any>): void => {

    // Check if both fields are empty
    if (!values.companyAdminPortal && !values.clientPortal) {
      toast.error(
        "Please fill out at least one of the 'Company Admin Portal' or 'Client Portal' fields before submitting."
      );
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("Submitting form with values:", values);
    } catch (error) {
      console.error("Error submitting form", error);
      toast.error("An error occurred. Please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  const initialValues = {
    moduleName: "Documents",
    // moduleType: "coreModule",
    companyAdminPortal: "Upload and assign documents",
    clientPortal: "View and download assigned documents",
  };
  return (
    <ModuleForm
      initialValues={initialValues}
      submitFn={submitFn}
      headerText="Edit Core Module"
      isSubmitting={isSubmitting}
    />
  );
};

export default page;
