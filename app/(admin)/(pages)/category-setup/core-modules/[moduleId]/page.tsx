import Link from "next/link";
import React from "react";
import { FiEdit } from "react-icons/fi";
import { IoArrowBack } from "react-icons/io5";
import { MdOutlineCancel } from "react-icons/md";

const page = ({params}: any) => {
    let moduleId = params.moduleId
  return (
    <div className="px-5 pb-20">
      <header className="flex w-full justify-between items-center">
        <h3 className="font-semibold text-xl text-[#334155] ">
          Lending Home Page Template 1
        </h3>
        <div className="flex items-center gap-2">
          <Link
            href={`/category-setup/core-modules/${moduleId}/edit-module`}
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
        <div>
          <label className="text-[#334155] text-xs font-normal">
            Module Name
          </label>
          <p className="text-[#334155] text-base font-medium">
            Lending Home Page Template 1
          </p>
        </div>
        <div>
          <label className="text-[#334155] text-xs font-normal">
            Company Admin Portal Feature Description
          </label>
          <p className="text-[#334155] text-base font-medium">
            Media center to upload media on client home screen
          </p>
        </div>
        <div>
          <label className="text-[#334155] text-xs font-normal">
            Client Portal Feature Description
          </label>
          <p className="text-[#334155] text-base font-medium">
            Home screen template for a lending-focused company
          </p>
        </div>
        <div>
          <label className="text-[#334155] text-xs font-normal">
            Module is a template
          </label>
          <p className="text-[#334155] text-base font-medium">Yes</p>
        </div>
      </div>
    </div>
  );
};

export default page;
