"use client";
import { FormikHelpers } from "formik";
import React, { useState } from "react";

import { toast } from "sonner";
import ModuleForm from "../../components/ModuleForm";
import { useRouter } from "next/navigation";
import services from "@/services";

const page = () => {
  // states for handling submission
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  //state for handling module name
  const [moduleName, setModuleName] = useState<any>();

  const router = useRouter();

  const submitFn = async (
    values: any,
    formikHelpers: FormikHelpers<any>
  ): Promise<void> => {
    if (!moduleName) {
      toast.error("Module name is required!");
      return;
    }

    // Check if both fields are empty
    if (!values.companyAdminPortal && !values.clientPortal) {
      toast.error(
        "Please fill out at least one of the 'Company Admin Portal' or 'Client Portal' fields before submitting."
      );

      return;
    }

    try {
      setIsSubmitting(true);

      const description = JSON.stringify({
        companyAdminPortal: values.companyAdminPortal,
        clientPortal: values.clientPortal,
      })
      const data = {
        id: 4,
        moduleName: moduleName,
        moduleDescription: description,
      };
      await services.createModule(data);
      formikHelpers.resetForm();
      router.back();
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error submitting form", error);
      toast.error("An error occurred. Please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  const initialValues = {
    moduleName: "",
    // moduleType: "coreModule",
    companyAdminPortal: "",
    clientPortal: "",
  };
  return (
    <ModuleForm
      initialValues={initialValues}
      submitFn={submitFn}
      headerText="Create Module"
      isSubmitting={isSubmitting}
      moduleName={moduleName}
      setModuleName={setModuleName}
    />
  );
};

export default page;
