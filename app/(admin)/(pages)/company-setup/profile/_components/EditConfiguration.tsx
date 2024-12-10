import Configuration from "@/app/[tenantId]/admin/company-profile/components/Configuration";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CompanyConfig from "../../components/CompanyConfig";
import { toast } from "sonner";
import services from "@/services";

const EditConfiguration = ({
  setEditConfiguration,
  coreModuleIds,
  categorySpecificModuleIds,
  companyBranding,
  queryClient,
}: {
  setEditConfiguration: any;
  coreModuleIds: string[];
  categorySpecificModuleIds: string[];
  companyBranding: any;
  queryClient: any;
}) => {
  // state for handling the selected category modules
  const [selectedCategoryModules, setSelectedCategoryModules] = useState<any>(
    []
  );

  // state for handling the selected category
  const [selectedCategory, setSelectedCategory] = useState<any>();

  // state for handling the submitting state
  const [submitting, setSubmitting] = useState<boolean>(false);

  // state for handling selected core modules
  const [selectedCoreModules, setSelectedCoreModules] = useState<any>([]);

  React.useEffect(() => {
    setSelectedCoreModules(coreModuleIds);
    setSelectedCategoryModules(categorySpecificModuleIds);

  }, [coreModuleIds, categorySpecificModuleIds]);

  const editCompanyConfiguration = async () => {
    try {
      setSubmitting(true);
      // call the api to update the company configuration
      const selectedCoreModuleIds = selectedCoreModules.reduce(
        (acc: any, module: any) => {
          if (module?.id) {
            acc.push(module.id);
          }
          return acc;
        },
        []
      );

      const selectedCategoryModuleIds = selectedCategoryModules.reduce(
        (acc: any, module: any) => {
          if (module?.id) {
            acc.push(module.id);
          }
          return acc;
        },
        []
      );

      console.log("company branding ", companyBranding);

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
