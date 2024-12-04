"use client";
import Loader from "@/components/Loader/Loader";
import services from "@/services";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { FiEdit } from "react-icons/fi";
import { IoArrowBack } from "react-icons/io5";
import { MdOutlineCancel } from "react-icons/md";

const page = ({ params }: any) => {
  // getting the module id
  let moduleId = params.moduleId;

  // getting the module data
  const { data: moduleData, isLoading } = useQuery({
    queryKey: ["module", moduleId],
    queryFn: services.getModuleByID(moduleId),
    enabled: Boolean(moduleId),
  });

  const router = useRouter();

  const [parsedDescription, setParsedDescription] = React.useState<any>(null);

  React.useEffect(() => {
    if (moduleData) {
      try {
        setParsedDescription(JSON.parse(moduleData.moduleDescription));
      } catch (error) {
        console.log("Error parsing module description", error);
        setParsedDescription(null);
      }
    }
  }, [moduleData]);

  React.useEffect(() => {
    console.log('parsed description changed to ', parsedDescription);
  }, [parsedDescription]);

  if (isLoading) {
    return <Loader text="Loading module details" />;
  }
  return (
    <div className="px-5 pb-20">
      <header className="flex w-full justify-between items-center">
        <h3 className="font-semibold text-xl text-[#334155] ">
          {moduleData?.moduleName}
        </h3>
        <div className="flex items-center gap-2">
          <Link
            href={`/category-setup/core-modules/${moduleId}/edit`}
            className="bg-[#F8FAFC] border border-[#CBD5E1] shadow-sm py-2 flex text-[#475569] text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
          >
            <FiEdit color="inherit" />
            Edit
          </Link>
          <button
            onClick={() => router.back()}
            type="button"
            className="bg-[#EF4444] border border-[#DC2626] shadow-sm py-2 flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
          >
            <MdOutlineCancel color="inherit" />
            Delete Module
          </button>
        </div>
      </header>
      <div className="mt-2">
        <button
          // onClick={() => null}
          type="button"
          className="bg-white border border-[#CBD5E1] shadow-sm py-2 flex text-[#334155] text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
        >
          <IoArrowBack />
          Back
        </button>
      </div>
      <div className="py-4">
        <h3 className="font-semibold text-lg text-primary-dark ">
          Module Details
        </h3>
      </div>
      <div className="space-y-4">
        {/* MODULE NAME */}
        <div>
          <label className="text-[#334155] text-xs font-normal">
            Module Name
          </label>
          <p className="text-[#334155] text-base font-medium">
            {moduleData?.moduleName}
          </p>
        </div>
        {/* COMPANY ADMIN PORTAL FEATURE DESCRIPTION */}
        <div>
          <label className="text-[#334155] text-xs font-normal">
            Company Admin Portal Feature Description
          </label>
          <p className="text-[#334155] text-base font-medium">
            {parsedDescription
              ? parsedDescription?.companyAdminPortal
              : moduleData?.moduleDescription}
          </p>
        </div>
        {/* CLIENT PORTAL FEATURE DESCRIPTION */}

        <div>
          <label className="text-[#334155] text-xs font-normal">
            Client Portal Feature Description
          </label>
          <p className="text-[#334155] text-base font-medium">
            {parsedDescription
              ? parsedDescription?.clientPortal
              : moduleData?.moduleDescription}
          </p>
        </div>
        {/* IS TEMPLATE FEATURE */}
        {moduleData?.isTemplate && (
          <div>
            <label className="text-[#334155] text-xs font-normal">
              Module is a template
            </label>
            <p className="text-[#334155] text-base font-medium">
              {moduleData?.isTemplate ? "Yes" : "No"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
