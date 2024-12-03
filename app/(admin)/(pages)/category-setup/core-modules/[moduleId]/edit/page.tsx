"use client";
import { FormikHelpers } from "formik";
import React from "react";

import { toast } from "sonner";
import ModuleForm from "../../../components/ModuleForm";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import Loader from "@/components/Loader/Loader";

const page = ({ params }: any) => {
  const moduleId = params.moduleId;

  //getting the module data
  const { data: moduleData, isLoading } = useQuery({
    queryKey: ["module", moduleId],
    queryFn: services.getModuleByID(moduleId),
    enabled: Boolean(moduleId),
  });

  // states for handling form submission
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  const [initialValues, setInitialValues] = React.useState<any>({
    moduleName: "",
    companyAdminPortal: "",
    clientPortal: ""
  })

  const submitFn = async (values: any, formikHelpers: FormikHelpers<any>): Promise<void> => {
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
      const data = {
        id: moduleId,
        moduleName: values.moduleName,
        moduleDescription: `${values?.companyAdminPortal},${values?.clientPortal}`
      }

      await services.updateModule(data)

      toast.success(`Successfully edited ${values.moduleName} module`)
    } catch (error) {
      console.error("Error submitting form", error);
      toast.error("An error occurred. Please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  React.useEffect(() => {

    if(moduleData){
      console.log('there is module data')
      console.log('here',moduleData)
      let initial = {
        moduleName: moduleData?.moduleName,
        // moduleType: "coreModule",
        companyAdminPortal: moduleData?.moduleDescription,
        clientPortal: moduleData?.moduleDescription,
      };
      setInitialValues(initial)
    }
  }, [moduleData])

  React.useEffect(() => console.log('changed to ',initialValues),[initialValues])
  if(isLoading && !moduleData){
    return <Loader text="Loading module details" />
  }
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
