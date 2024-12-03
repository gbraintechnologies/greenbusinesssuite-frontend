"use client";
import { FormikHelpers } from "formik";
import React from "react";

import { toast } from "sonner";
import ModuleForm from "../../../components/ModuleForm";
import { useSearchParams } from "next/navigation";

const page = () => {
  // getting the module id
  const searchParams = useSearchParams();
  const moduleId = searchParams.get("module");

  // states for handling form submission
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  //state for handling module name
  const [moduleName, setModuleName] = React.useState<any>();

  const submitFn = (values: any, formikHelpers: FormikHelpers<any>): void => {
    if (!moduleName) {
      toast.error("Module name is required");
      return;
    }
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
    // moduleName: "Documents",
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
      moduleName={moduleName}
      setModuleName={setModuleName}
    />
  );
};

export default page;
