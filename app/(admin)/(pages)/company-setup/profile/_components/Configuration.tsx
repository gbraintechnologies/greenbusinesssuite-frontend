"use client";
import React from "react";
import ModuleCard from "../../components/ModuleCard";
import "../index.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import services from "@/services";
import Loader from "@/components/Loader/Loader";
import NoItems from "@/components/NoItems/NoItems";
import EditConfiguration from "./EditConfiguration";

const Configuration = ({ tenantId }: { tenantId: string }) => {
  const { data: companyBranding, isLoading } = useQuery({
    queryKey: ["branding", tenantId],
    queryFn: services.getCompanyBranding(tenantId),
    enabled: Boolean(tenantId),
  });

  const { data: category, isLoading: categoryLoading } = useQuery({
    queryKey: [
      "category_by_module_id",
      companyBranding?.categorySpecificModules[0]?.id,
    ],
    queryFn: services.getCategoryByCategorySpecificModuleId(
      companyBranding?.categorySpecificModules[0]?.id
    ),
    enabled: Boolean(companyBranding?.categorySpecificModules[0]?.id),
  });

  const [editCompanyBranding, setEditCompanyBranding] = React.useState(false);

  const queryClient = useQueryClient();

  if (isLoading || categoryLoading) {
    return <Loader text="Loading branding information" />;
  }

  return (
    <>
      {editCompanyBranding ? (
        <EditConfiguration
          setEditConfiguration={setEditCompanyBranding}
          coreModules={companyBranding?.modules}
          categorySpecificModules={companyBranding?.categorySpecificModules}
          companyBranding={companyBranding}
          queryClient={queryClient}
          moduleCategory={category}
        />
      ) : (
        <div className="w-full my-6">
          {category && (
            <div className=" ">
              <div className="flex items-center justify-between w-full">
                <h3 className="text-lg text-primary-dark font-semibold">
                  Category Details
                </h3>
                <button
                  type="button"
                  className="bg-white disabled:bg-gray-400 py-3 text-black border w-auto px-3 flex items-center justify-center border-[rgba(226, 232, 240, 1)] text-sm hover:opacity-95 items-center gap-2 rounded-xl"
                  onClick={() => setEditCompanyBranding(true)}
                >
                  Edit Configuration
                </button>
              </div>

              <div className="mb-2">
                <label className="text-[#334155] text-xs font-normal">
                  Category Name
                </label>
                <p className="text-[#334155] text-base font-medium ">
                  {category?.categoryName}
                </p>
              </div>
              <div className="my-2">
                <label className="text-[#334155] text-xs font-normal">
                  Category Description
                </label>
                <p className="text-[#334155] text-base font-medium">
                  {category?.categoryDescription}
                </p>
              </div>
            </div>
          )}
          <div className="mt-4">
            <div>
              <header className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg text-primary-dark font-semibold">
                    Category Specific Modules
                  </h3>
                  <p className="text-[#667085] text-sm">
                    Modules tailor-made for specific categories{" "}
                  </p>
                </div>
                {!category && (
                  <button
                    type="button"
                    className="bg-white disabled:bg-gray-400 py-3 text-black border w-auto px-3 flex items-center justify-center border-[rgba(226, 232, 240, 1)] text-sm hover:opacity-95 items-center gap-2 rounded-xl"
                    onClick={() => setEditCompanyBranding(true)}
                  >
                    Edit Configuration
                  </button>
                )}
              </header>
              {companyBranding?.categorySpecificModules?.length > 0 ? (
                <div className="mt-3 grid grid-cols-3 gap-2 w-full">
                  {companyBranding?.categorySpecificModules?.map(
                    (module: any, index: number) => (
                      <ModuleCard
                        moduleData={module}
                        companyAdminPortal={module?.adminFeatures}
                        clientPortal={module?.clientFeatures}
                        disableCheckboxes={true}
                        defaultChecked={true}
                        index={index + "category"}
                      />
                    )
                  )}
                </div>
              ) : (
                <NoItems
                  subtext="There are no modules for this
                  category"
                  headerText="No modules"
                />
              )}
            </div>
            <div className="mt-3">
              <header>
                <h3 className="text-lg text-primary-dark font-semibold">
                  Core Modules
                </h3>
                <p className="text-[#667085] text-sm">
                  Core Modules that apply to all industries{" "}
                </p>
              </header>
              {companyBranding?.modules?.length > 0 ? (
                <div className="mt-3 grid grid-cols-3 gap-2 w-full">
                  {companyBranding?.modules?.map(
                    (module: any, index: number) => (
                      <ModuleCard
                        moduleData={module}
                        companyAdminPortal={module?.adminFeatures}
                        clientPortal={module?.clientFeatures}
                        disableCheckboxes={true}
                        defaultChecked={true}
                        index={index + "core"}
                      />
                    )
                  )}
                </div>
              ) : (
                <NoItems
                  subtext="There are no core modules enabled"
                  headerText="No modules"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Configuration;
