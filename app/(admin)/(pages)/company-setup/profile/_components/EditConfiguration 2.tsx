import Configuration from "@/app/[tenantId]/admin/company-profile/components/Configuration";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CompanyConfig from "../../components/CompanyConfig";
import { toast } from "sonner";
import services from "@/services";

const EditConfiguration = ({
  setEditConfiguration,
  coreModules,
  categorySpecificModules,
  companyBranding,
  queryClient,
  moduleCategory,
}: {
  setEditConfiguration: any;
  coreModules: any[];
  categorySpecificModules: any[];
  companyBranding: any;
  queryClient: any;
  moduleCategory: any;
}) => {
  // state for handling the selected category modules
  const [selectedCategoryModules, setSelectedCategoryModules] = useState<any>(
    []
  );

  // state for handling the selected category
  const [selectedCategory, setSelectedCategory] = useState<any>(moduleCategory);

  // state for handling the submitting state
  const [submitting, setSubmitting] = useState<boolean>(false);

  // state for handling selected core modules
  const [selectedCoreModules, setSelectedCoreModules] = useState<any>([]);

  // setting the selected core modules state and the selected category modules state
  React.useEffect(() => {
    setSelectedCoreModules(coreModules);
    setSelectedCategoryModules(categorySpecificModules);
    setSelectedCategory(moduleCategory);
  }, [coreModules, categorySpecificModules, moduleCategory]);

  // function to edit company configuration
  const editCompanyConfiguration = async () => {
    try {
      setSubmitting(true);

      // get the selected core module ids from the selected core modules
      const selectedCoreModuleIds = selectedCoreModules.reduce(
        (acc: any, module: any) => {
          if (module?.id) {
            acc.push(module.id);
          }
          return acc;
        },
        []
      );

      // get the selected category module ids from the selected category modules
      const selectedCategoryModuleIds = selectedCategoryModules.reduce(
        (acc: any, module: any) => {
          if (module?.id) {
            acc.push(module.id);
          }
          return acc;
        },
        []
      );

      // call the edit company branding service to update the company configuration
      await services.editCompanyBranding(
        companyBranding?.id,
        companyBranding?.companyId,
        companyBranding?.tenancyId,
        companyBranding?.logo,
        companyBranding?.color,
        companyBranding?.companyName,
        selectedCoreModuleIds,
        selectedCategoryModuleIds
      );

      // invalidate the company branding query to refetch the updated company branding
      queryClient.invalidateQueries(["branding", companyBranding?.tenancyId]);
      toast.success("Company configuration updated successfully");
      setEditConfiguration(false);
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while updating company configuration");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="my-6">
      <CompanyConfig
        discardFn={() => setEditConfiguration(false)}
        saveFn={() => editCompanyConfiguration()}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        setSelectedCoreModules={setSelectedCoreModules}
        setSelectedCategoryModules={setSelectedCategoryModules}
        selectedCoreModules={selectedCoreModules}
        selectedCategoryModules={selectedCategoryModules}
        submitting={submitting}
      />
    </div>
  );
};

export default EditConfiguration;
