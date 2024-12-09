"use client";
import Loader from "@/components/Loader/Loader";
import Modal from "@/components/Modal/Modal";
import services from "@/services";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import React from "react";
import { FiEdit } from "react-icons/fi";
import { IoArrowBack } from "react-icons/io5";
import { MdOutlineCancel } from "react-icons/md";
import { toast } from "sonner";

const page = ({ params }: any) => {
  // getting the module id
  let moduleId = params.moduleId;

  // getting the module data
  const {
    data: moduleData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["module", moduleId],
    queryFn: services.getCoreModuleByID(moduleId),
    enabled: Boolean(moduleId),
  });

  const router = useRouter();

  // state for handling the delete modal
  const [showCancelModal, setShowCancelModal] = React.useState<boolean>(false);

  // const [parsedDescription, setParsedDescription] = React.useState<any>(null);

  // React.useEffect(() => {
  //   if (moduleData) {
  //     try {
  //       setParsedDescription(JSON.parse(moduleData.moduleDescription));
  //     } catch (error) {
  //       console.log("Error parsing module description", error);
  //       setParsedDescription(null);
  //     }
  //   }
  // }, [moduleData]);

  //function to delete the module
  const deleteModule = async () => {
    try {
      await services.deleteCoreModuleByID(moduleId);
      toast.success("Module deleted successfully");
      router.push("/category-setup/core-modules");
    } catch (error) {
      console.log("Error deleting module", error);
    }
  };

  React.useEffect(() => {
    if (error) {
      notFound();
    }
  }, [error]);

  if (isLoading) {
    return <Loader text="Loading module details" />;
  }
  return (
    <>
      <div className="px-5 pb-20">
        <header className="flex w-full justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              type="button"
              className="bg-white border border-[#CBD5E1] shadow-sm p-2 flex text-[#334155] text-sm  hover:opacity-95 items-center gap-2 rounded-xl"
            >
              <IoArrowBack />
              {/* Back */}
            </button>
            <h3 className="font-semibold text-xl text-[#334155] ">
              {moduleData?.moduleName}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/category-setup/core-modules/${moduleId}/edit`}
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
        
        <div className="py-3">
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
          {/* MODULE DESCRIPTION IF THERE IS NO COMPANY ADMIN DESCRIPTION AND CLIENT DESCRIPTION */}

          {/* COMPANY ADMIN PORTAL FEATURE DESCRIPTION */}
          {moduleData?.adminFeatures && (
            <div>
              <label className="text-[#334155] text-xs font-normal">
                Company Admin Portal Feature Description
              </label>
              <p className="text-[#334155] text-base font-medium">
                {moduleData?.adminFeatures}
              </p>
            </div>
          )}
          {/* CLIENT PORTAL FEATURE DESCRIPTION */}

          {moduleData?.clientFeatures && (
            <div>
              <label className="text-[#334155] text-xs font-normal">
                Client Portal Feature Description
              </label>
              <p className="text-[#334155] text-base font-medium">
                {moduleData?.clientFeatures}
              </p>
            </div>
          )}
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
      <Modal
        isOpen={showCancelModal}
        setIsOpen={setShowCancelModal}
        title={`Are you sure you want to delete the ${moduleData?.moduleName} module?`}
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
