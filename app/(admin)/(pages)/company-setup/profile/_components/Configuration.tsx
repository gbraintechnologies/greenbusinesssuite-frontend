"use client";
import React from "react";
import ModuleCard from "../../components/ModuleCard";
import "../index.css";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import Loader from "@/components/Loader/Loader";

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
      <div className=" ">
        <h3 className="text-lg text-primary-dark font-semibold">
          Category Details
        </h3>

        <div className="my-2">
          <label className="text-[#334155] text-xs font-normal">
            Category Name
          </label>
          <p className="text-[#334155] text-base font-medium ">
            Micro-lending{" "}
          </p>
        </div>
        <div className="my-2">
          <label className="text-[#334155] text-xs font-normal">
            Category Description
          </label>
          <p className="text-[#334155] text-base font-medium">
            This category is for companies that provide micro-lending services.
          </p>
        </div>
      </div>
      <div className="mt-4">
        <div>
          <header>
            <h3 className="text-lg text-primary-dark font-semibold">
              Industry Modules
            </h3>
            <p className="text-[#667085] text-sm">
              Modules tailor-made for specific industries
            </p>
          </header>
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
        </div>
      </div>
    </div>
  );
};

export default Configuration;
