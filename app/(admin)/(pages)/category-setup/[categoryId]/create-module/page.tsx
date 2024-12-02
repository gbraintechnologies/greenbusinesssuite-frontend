"use client";
import { FormikHelpers } from "formik";
import React, { useState } from "react";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ModuleForm from "../../components/ModuleForm";

const page = ({params}: any) => {
  // getting the category id
  let categoryId = params.categoryId;

  // states for handling submission
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const router = useRouter();

  const submitFn = (values: any, formikHelpers: FormikHelpers<any>): void => {


    // Check if both fields are empty
    if (!values.companyAdminPortal && !values.clientPortal) {
      toast.error(
        "Please fill out at least one of the 'Company Admin Portal' or 'Client Portal' fields before submitting."
      );
      
      
      return;
    }

    try {
      setIsSubmitting(true)
      console.log("Submitting form with values:", values);
      formikHelpers.resetForm();
      router.back()
    } catch (error) {
      setIsSubmitting(false)
      console.error("Error submitting form", error);
      toast.error("An error occurred. Please try again");
    } finally {
      setIsSubmitting(false)
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
      headerText="Create Category Specific Module"
      isSubmitting={isSubmitting}
      isCategorySpecificModule={true}
    />
  );
};

export default page;
