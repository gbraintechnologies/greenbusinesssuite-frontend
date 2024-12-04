"use client";
import { FormikHelpers } from "formik";
import React, { useState } from "react";

import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import ModuleForm from "../../../components/ModuleForm";
import services from "@/services";

const page = () => {
  // getting the category id
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("catId");

    //state for handling module name
    const [moduleName, setModuleName] = useState<any>();

    //state for handling whether module is a template or not
    const [isTemplate, setIsTemplate] = useState<boolean>(false);

  // states for handling submission
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const router = useRouter();

  const submitFn = async(values: any, formikHelpers: FormikHelpers<any>): Promise<void> => {

    if (!moduleName) {
      toast.error("Module name is required");
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
      console.log("Submitting form with values:", values);
      const data = {
        moduleName: moduleName,
        adminFeatures: values.companyAdminPortal,
        clientFeatures: values.clientPortal,
        template: isTemplate
      }

      await services.createCategorySpecificModule(Number(categoryId), data);
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
    // moduleName: "",
    // moduleType: "coreModule",
    companyAdminPortal: "",
    clientPortal: "",
  };
  return (
    <ModuleForm
      initialValues={initialValues}
      submitFn={submitFn}
      headerText="Create Category Specific Module"
      isSubmitting={isSubmitting}
      isCategorySpecificModule={true}
      moduleName={moduleName}
      setModuleName={setModuleName}
      isTemplate={isTemplate}
      setIsTemplate={setIsTemplate}
    />
  );
};

export default page;
