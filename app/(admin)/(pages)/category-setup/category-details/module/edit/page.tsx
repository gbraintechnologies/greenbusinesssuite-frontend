"use client";
import { FormikHelpers } from "formik";
import React from "react";

import { toast } from "sonner";
import ModuleForm from "../../../components/ModuleForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";

const page = () => {
  // getting the module id
  const searchParams = useSearchParams();
  const moduleId = searchParams.get("module");
  const categoryId = searchParams.get("catId");

  // states for handling form submission
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  //state for handling module name
  const [moduleName, setModuleName] = React.useState<any>();

  //state for handling whether module is a template or not
  const [isTemplate, setIsTemplate]= React.useState<boolean>(false);

  // getting the specific module data
  const { data: module, isLoading } = useQuery({
    queryKey: ["category", categoryId, "module", moduleId],
    queryFn: () =>
      services.getAllSpecificModuleCategoryByID(Number(categoryId)),
    enabled: Boolean(categoryId), // only fetch if categoryId is available
    select: (data: any) => {
      return data?.find((module: any) => module.id == moduleId);
    },
  });

  const router = useRouter();

  const submitFn = async (
    values: any,
    formikHelpers: FormikHelpers<any>
  ): Promise<void> => {
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
      setIsSubmitting(true);

      // Construct the updated module data
      const updatedModule = {
        id: moduleId,
        moduleName: moduleName,
        adminFeatures: values.companyAdminPortal,
        clientFeatures: values.clientPortal,
        template: isTemplate
      };

      // Fetch the current category data
      const categoryData = await services.getSpecificCategoryByID(
        Number(categoryId)
      );

      if (!categoryData || !categoryData.categorySpecificModules) {
        throw new Error("Category data or category specific modules not found");
      }

      // Update the specific module within categorySpecificModules
      const updatedCategoryModules = categoryData.categorySpecificModules.map(
        (module: any) =>
          module.id == moduleId ? { ...module, ...updatedModule } : module
      );

      // Prepare the updated category object
      const updatedCategory = {
        ...categoryData,
        categorySpecificModules: updatedCategoryModules,
      };

      // Send the updated category back to the server
      await services.updateSpecificCategory(updatedCategory);

      toast.success("Module updated successfully");

      router.back();
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
    companyAdminPortal: module?.adminFeatures,
    clientPortal: module?.clientFeatures,
  };

  React.useEffect(() => {
    setModuleName(module?.moduleName);
    setIsTemplate(module?.template);
  }, [module]);

  return (
    <ModuleForm
      initialValues={initialValues}
      submitFn={submitFn}
      headerText="Edit Category Specific Module"
      isSubmitting={isSubmitting}
      moduleName={moduleName}
      setModuleName={setModuleName}
      isCategorySpecificModule={true}
      isTemplate={isTemplate}
      setIsTemplate={setIsTemplate}
    />
  );
};

export default page;
