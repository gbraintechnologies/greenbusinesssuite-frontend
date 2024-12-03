import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { FiEdit } from "react-icons/fi";
import { IoArrowBack } from "react-icons/io5";
import { MdOutlineCancel } from "react-icons/md";

const page = () => {
  // getting the module id
  const searchParams = useSearchParams();
  const moduleId = searchParams.get("module");

  const dummyModule: any = {
    moduleName: "Lending Home Page Template 1",
    companyAdminPortal: "Media center to upload media on client home screen",
    clientPortal: "Home screen template for a lending-focused company",
  };
  return (
    <div className="px-5 pb-20">
      <header className="flex w-full justify-between items-center">
        <h3 className="font-semibold text-xl text-[#334155] ">
          Lending Home Page Template 1
        </h3>
        <div className="flex items-center gap-2">
          <Link
            href={`/category-setup/category-details/module/edit?module=${moduleId}`}
            className="bg-[#F8FAFC] border border-[#CBD5E1] shadow-sm py-2 flex text-[#475569] text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
          >
            <FiEdit color="inherit" />
            Edit
          </Link>
          <button
            // onClick={() => null}
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
            {dummyModule?.moduleName}
          </p>
        </div>
        {/* COMPANY ADMIN PORTAL FEATURE DESCRIPTION */}
        <div>
          <label className="text-[#334155] text-xs font-normal">
            Company Admin Portal Feature Description
          </label>
          <p className="text-[#334155] text-base font-medium">
            {dummyModule?.companyAdminPortal}
          </p>
        </div>
        {/* CLIENT PORTAL FEATURE DESCRIPTION */}

        <div>
          <label className="text-[#334155] text-xs font-normal">
            Client Portal Feature Description
          </label>
          <p className="text-[#334155] text-base font-medium">
            {dummyModule?.clientPortal}
          </p>
        </div>
        {/* IS TEMPLATE FEATURE */}
        {dummyModule?.isTemplate && (
          <div>
            <label className="text-[#334155] text-xs font-normal">
              Module is a template
            </label>
            <p className="text-[#334155] text-base font-medium">
              {dummyModule?.isTemplate ? "Yes" : "No"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
