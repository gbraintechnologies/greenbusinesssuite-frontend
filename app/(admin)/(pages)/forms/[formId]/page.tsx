"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// icons
import { FiEdit2 } from "react-icons/fi";
import { VscLink } from "react-icons/vsc";

//components
import Modal from "@/components/Modal/Modal";

// services
import { useQuery, useQueryClient } from "@tanstack/react-query";
import services from "@/services";

// COMPONENTS
import AssignForm from "./components/AssignForm";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import PublishFormButton from "../builder/PublishFormButton";

// toast
import toast from "react-hot-toast";

// extra components
import ResponseDataTable from "@/app/company/(pages)/forms/components/ResponseTable/ResponseDataTable";

function FormDetail({ params }: any) {
  let formID = params.formId;

  const [view, setView] = useState("responses");

  //
  const [showUnpublishModal, setShowUnpublishModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const { data: formResponseData, isLoading: isResponseLoading } = useQuery({
    queryKey: ["get form response by ", Number(formID)],
    queryFn: services.getFormResponseById(Number(formID)),
  });

  const exportToExcel = (responses: any) => {
    toast.success("Exported");
  };

  //
  const router = useRouter();

  const queryClient = useQueryClient();

  const { data: form, isLoading } = useQuery({
    queryKey: ["form", parseInt(formID)],
    queryFn: services.getFormById(formID),
    enabled: Boolean(formID),
  });

  const { data: companies } = useQuery({
    queryKey: ["all companies"],
    queryFn: services.getAllCompanies(),
  });

  useEffect(() => {}, [form]);
  if (isLoading) {
    return (
      <div className="h-[20rem] flex items-center justify-center">
        <div>
          <LoadingIcon />
          <p className="mt-2 text-xs text-gray-500">Fetching form details</p>
        </div>
      </div>
    );
  }

  // use props in data directly to avoid lags in changes in react query cache
  if (form) {
    return (
      <div>
        {/* HEADER */}
        <div className="flex items-center justify-between px-5">
          <div>
            <h3 className="text-xl font-semibold">
              <span className="font-light text-gray-500">Forms /</span>{" "}
              {form?.name}{" "}
            </h3>
          </div>

          <div className="flex gap-2 items-center">
            {Boolean(form?.url) && (
              <button
                onClick={() => {
                  if (form?.publishStatus.toLowerCase() === "published") {
                    navigator.clipboard.writeText(form?.url).then(() => {
                      toast.dismiss();
                      toast.success("Form link copied!");
                    });
                    return;
                  }
                  toast.dismiss();
                  toast.error("Publish form first to access a shareable link");
                }}
                className="btn-outline"
              >
                <VscLink /> Copy Form Link
              </button>
            )}

            {!Boolean(form?.companyName) && (
              <button
                onClick={() => setShowAssignModal(true)}
                className="btn-outline"
              >
                <VscLink /> Assign Form
              </button>
            )}

            <button
              onClick={() => {
                router.push(`/forms/builder/${formID}`);
              }}
              className="btn-outline"
            >
              {" "}
              <FiEdit2 />
              Edit form
            </button>

            <PublishFormButton
              showUnpublishModal={showUnpublishModal}
              setShowUnpublishModal={setShowUnpublishModal}
              companies={companies}
              formID={form?.id}
            />
          </div>
        </div>

        {/* VIEWS SELECTOR */}
        {/* <div className="flex justify-between mt-5 items-center px-5">
          <div className="bg-[#F1F5F9]  flex items-center gap-2 rounded-xl my-1 p-1 bg-opacity-50">
            <button
              onClick={() => setView("responses")}
              className={`${
                view === "responses"
                  ? "bg-white font-medium shadow-sm"
                  : "text-[#64748B] font-light "
              } p-1 rounded-lg px-7`}
            >
              Responses
            </button>
          </div>
        </div> */}

        {/* RENDER VIEWS */}
        {/* {view === "responses" && (
          <div>UI In progress</div>
          <div className="p-6">
            <ResponseDataTable
              responseData={formResponseData}
              isResponseLoading={isResponseLoading}
              exportToExcel={exportToExcel}
            />
          </div>
        )} */}

        {/* ASSIGN TO NEW COMPANY MODAL */}
        <Modal
          isOpen={showAssignModal}
          setIsOpen={setShowAssignModal}
          title={`Assign company to form `}
        >
          <AssignForm
            id={formID}
            setShow={setShowAssignModal}
            companies={companies}
            queryClient={queryClient}
          />
        </Modal>
      </div>
    );
  }
}

export default FormDetail;
