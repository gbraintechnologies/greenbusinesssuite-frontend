"use client";
import Loader from "@/components/Loader/Loader";
import Modal from "@/components/Modal/Modal";
import services from "@/services";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { FiEdit } from "react-icons/fi";
import { IoArrowBack } from "react-icons/io5";
import { MdOutlineCancel } from "react-icons/md";
import { toast } from "sonner";

const page = () => {
  // getting the module id
  const searchParams = useSearchParams();
  const moduleId = searchParams.get("module");
  const categoryId = searchParams.get("catId");

  const router = useRouter();

  const [showCancelModal, setShowCancelModal] = React.useState<boolean>(false);

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

  //function to delete module
  const deleteModule = async () => {
    try {
      await services.deleteSpecificModuleFromCategory(
        Number(categoryId),
        Number(moduleId)
      );
      toast.success("Module deleted successfully");
      router.push("/category-setup/category-details?categoryId=" + categoryId);
    } catch (error) {
      toast.error("An error occurred. Please try again");
      console.log("Error deleting module", error);
    }
  };

  if (isLoading) {
    return <Loader text="Loading module" />;
  }
  return (
    <>
      <div className="px-5 pb-20">
        <header className="flex w-full justify-between items-center">
          <h3 className="font-semibold text-xl text-[#334155] ">
            {module?.moduleName}
          </h3>
          <div className="flex items-center gap-2">
            <Link
              href={`/category-setup/category-details/module/edit?catId=${categoryId}&module=${moduleId}`}
              className="bg-[#F8FAFC] border border-[#CBD5E1] shadow-sm py-2 flex text-[#475569] text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
            >
              <FiEdit color="inherit" />
              Edit
            </Link>
            <button
              onClick={() => setShowCancelModal(true)}
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
            onClick={() => router.back()}
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
              {module?.moduleName}
            </p>
          </div>
          {/* COMPANY ADMIN PORTAL FEATURE DESCRIPTION */}
          {module?.adminFeatures && (
            <div>
              <label className="text-[#334155] text-xs font-normal">
                Company Admin Portal Feature Description
              </label>
              <p className="text-[#334155] text-base font-medium">
                {module?.adminFeatures}
              </p>
            </div>
          )}
          {/* CLIENT PORTAL FEATURE DESCRIPTION */}

          {module?.clientFeatures && (
            <div>
              <label className="text-[#334155] text-xs font-normal">
                Client Portal Feature Description
              </label>
              <p className="text-[#334155] text-base font-medium">
                {module?.clientFeatures}
              </p>
            </div>
          )}
          {/* IS TEMPLATE FEATURE */}
          <div>
            <label className="text-[#334155] text-xs font-normal">
              Module is a template
            </label>
            <p className="text-[#334155] text-base font-medium">
              {module?.template ? "Yes" : "No"}
            </p>
          </div>
        </div>
      </div>
      <Modal
        isOpen={showCancelModal}
        setIsOpen={setShowCancelModal}
        title={`Are you sure you want to delete the ${module?.moduleName} module?`}
        // showTitle={false}
      >
        <div>
          {/* <h1 className="text-xl text-primary-dark px-5 pb-2 font-medium">{`Are you sure you want to delete the ${moduleData?.moduleName} module?`}</h1> */}
          <p className="px-5 border-t text-[#334155] text-base pt-3">
            Deleting this module will remove all associated data and cannot be
            undone.
          </p>

          <div className=" px-5 py-3 border-t-[1px] border-t-gray-200 flex bg-[#F1F5F9] justify-between mt-3">
            <button
              onClick={() => setShowCancelModal(false)}
              className="bg-gray-50 border border-gray-200 shadow-md px-8 py-2 flex text-primary-dark text-sm hover:opacity-95 items-center gap-2 rounded-xl"
            >
              Cancel
            </button>
            <button
              className="bg-primary-red py-3 shadow-md flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
              onClick={async () => {
                await deleteModule();
              }}
            >
              Yes, delete module
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default page;
