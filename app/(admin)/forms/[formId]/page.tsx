"use client";

import React, { useState } from "react";

// icons
import { FiEdit2 } from "react-icons/fi";
import { VscLink } from "react-icons/vsc";
import { LuUploadCloud } from "react-icons/lu";

//
import Company from "./components/Company";
import ConnectForm from "./components/ConnectForm";
import Modal from "@/components/Modal/Modal";

import { useQuery } from "@tanstack/react-query";
import services from "@/services";

// COMPONENTS
import UnpublishForm from "./components/UnpublishForm";
import AssignForm from "./components/AssignForm";
import { useRouter } from "next/navigation";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";

function FormDetail({ params }: any) {
  const [view, setView] = useState("company");

  //
  const [showUnpublishModal, setShowUnpublishModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  //
  const router = useRouter();

  let formID = params.formId;

  const { data, isLoading } = useQuery({
    queryKey: ["form", formID],
    queryFn: services.getFormById(formID),
    enabled: Boolean(formID),
  });

  const { data: companies } = useQuery({
    queryKey: ["all companies"],
    queryFn: services.getAllCompanies(),
  });

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

  if (data) {
    const { name, publishStatus, deadline, createdOn, description, id, url, companyNames } =
      data;
    return (
      <div>
        {/* HEADER */}
        <div className="flex items-center justify-between px-5">
          <div>
            <h3 className="text-xl font-semibold">
              <span className="font-light text-gray-500">Recent /</span> {name}{" "}
            </h3>
          </div>

          <div className="flex gap-2 items-center">
            <button
              onClick={() => setShowAssignModal(true)}
              className="btn-outline"
              disabled={companyNames?.length > 1}
            >
              <VscLink />
              {companyNames?.length > 1 ? "Assigned" : "Assign form"}
            </button>
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
            {publishStatus.toLowerCase() === "published" ? (
              <button
                onClick={() => setShowUnpublishModal(true)}
                className="bg-primary-red flex items-center justify-center gap-2 text-white text-sm py-2 px-3 rounded-lg"
              >
                <LuUploadCloud /> Unpublish
              </button>
            ) : (
              <button
                onClick={() => setShowPublishModal(true)}
                className="bg-primary-green flex items-center justify-center gap-2 text-white text-sm py-2 px-3 rounded-lg"
              >
                <LuUploadCloud /> Publish
              </button>
            )}
          </div>
        </div>

        {/* VIEWS SELECTOR */}
        <div className="flex justify-between mt-5 items-center px-5">
          <div className="bg-[#F1F5F9]  flex items-center gap-2 rounded-xl my-1 p-1 bg-opacity-50">
            <button
              onClick={() => setView("company")}
              className={`${
                view === "company"
                  ? "bg-white font-medium shadow-sm"
                  : "text-[#64748B] font-light "
              } p-1 rounded-lg px-7`}
            >
              Company assigned to forms
            </button>
            <button
              onClick={() => setView("connect")}
              className={`${
                view === "connect"
                  ? "bg-white font-medium shadow-sm"
                  : " text-[#64748B] font-light"
              } p-1 rounded-lg px-7`}
            >
              Connect
            </button>
          </div>
        </div>

        {/* RENDER VIEWS */}
        {view === "company" && <Company companies={companies} companyNames={companyNames}/>}
        {view === "connect" && (
          <div className="px-5 mt-5">
            <ConnectForm style="raw" />
          </div>
        )}

        {/* UNPUBLISH MODAL */}
        <Modal
          isOpen={showUnpublishModal}
          setIsOpen={setShowUnpublishModal}
          title={`Unpublish this form `}
        >
          <UnpublishForm id={formID} setShow={setShowUnpublishModal} />
        </Modal>

        {/* ASSIGN TO NEW COMPANY MODAL */}
        <Modal
          isOpen={showAssignModal}
          setIsOpen={setShowAssignModal}
          title={`Assign company to form `}
        >
          <AssignForm id={formID} setShow={setShowAssignModal} companies={companies}/>
        </Modal>
      </div>
    );
  }
}

export default FormDetail;
