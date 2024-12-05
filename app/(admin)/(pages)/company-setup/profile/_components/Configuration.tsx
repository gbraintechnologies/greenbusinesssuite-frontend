"use client";
import React from "react";
import ModuleCard from "../../components/ModuleCard";
import "../index.css";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import Loader from "@/components/Loader/Loader";
import NoItems from "@/components/NoItems/NoItems";

const Configuration = ({ tenantId }: { tenantId: string }) => {
  const { data: companyBranding, isLoading } = useQuery({
    queryKey: ["branding", tenantId],
    queryFn: services.getCompanyBranding(tenantId),
    enabled: Boolean(tenantId),
  });

  if (isLoading) {
    return <Loader text="Loading branding information" />;
  }

  return (
    <div className="w-full my-6">
      {/* <div className=" ">
        <h3 className="text-lg text-primary-dark font-semibold">
          Category Details
        </h3>

        <div className="my-2">
          <label className="text-[#334155] text-xs font-normal">
            Category Name
          </label>
          <p className="text-[#334155] text-base font-medium ">
          </p>
        </div>
        <div className="my-2">
          <label className="text-[#334155] text-xs font-normal">
            Category Description
          </label>
          <p className="text-[#334155] text-base font-medium">
          </p>
        </div>
      </div> */}
      <div className="mt-4">
        <div>
          <header>
            <h3 className="text-lg text-primary-dark font-semibold">
              Category Specific Modules
            </h3>
            <p className="text-[#667085] text-sm">
              Modules tailor-made for specific categories{" "}
            </p>
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
              {companyBranding?.modules?.map((module: any, index: number) => (
                <ModuleCard
                  moduleData={module}
                  companyAdminPortal={module?.adminFeatures}
                  clientPortal={module?.clientFeatures}
                  disableCheckboxes={true}
                  defaultChecked={true}
                  index={index + "core"}
                />
              ))}
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
  );
};

export default Configuration;
