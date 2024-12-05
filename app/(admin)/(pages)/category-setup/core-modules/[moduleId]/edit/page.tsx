"use client";
import { FormikHelpers } from "formik";
import React from "react";

import { toast } from "sonner";
import ModuleForm from "../../../components/ModuleForm";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import Loader from "@/components/Loader/Loader";
import { CoreModules } from "@/config/modules";
import { useRouter } from "next/navigation";

const page = ({ params }: any) => {
  const moduleId = params.moduleId;

  //getting the module data
  const { data: moduleData, isLoading } = useQuery({
    queryKey: ["module", moduleId],
    queryFn: services.getCoreModuleByID(moduleId),
    enabled: Boolean(moduleId),
  });

  // states for handling form submission
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  //state for handling module name
  const [moduleName, setModuleName] = React.useState<any>();

  const [initialValues, setInitialValues] = React.useState<any>({
    companyAdminPortal: "",
    clientPortal: "",
  });

  const router = useRouter();

  const submitFn = async (
    values: any,
    formikHelpers: FormikHelpers<any>
  ): Promise<void> => {
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
      setIsSubmitting(true);
      
      const data = {
        id: moduleId,
        moduleName: moduleName,
        adminFeatures: values.companyAdminPortal,
        clientFeatures: values.clientPortal,
      };

      await services.updateCoreModule(data);

      toast.success(`Successfully edited the ${moduleName} module`);
      router.back();
    } catch (error) {
      console.error("Error submitting form", error);
      toast.error("An error occurred. Please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  React.useEffect(() => {
    if (moduleData) {
      let parsedDescription: any;
      try {
        parsedDescription = JSON.parse(moduleData?.moduleDescription);
      } catch (error) {
        parsedDescription = null;
      }
      let initial = {
        // moduleName: moduleData?.moduleName,
        // moduleType: "coreModule",
        companyAdminPortal: moduleData?.adminFeatures ?? "",
        clientPortal: moduleData?.clientFeatures ?? "",
      };
      setInitialValues(initial);
      setModuleName(
        CoreModules.find((mod: string) => mod == moduleData?.moduleName)
      );
    }
  }, [moduleData]);

  React.useEffect(
    () => console.log("changed to ", initialValues),
    [initialValues]
  );
  if (isLoading && !moduleData) {
    return <Loader text="Loading module details" />;
  }
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
