"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { VscEmptyWindow } from "react-icons/vsc";
import { RiImageCircleLine } from "react-icons/ri";

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
import { toast } from "sonner";
import StatsBlock from "@/components/StatsBlock/StatsBlock";
import Image from "next/image";

function FormDetail({ params }: any) {
  let formID = params.formId;

  //
  const [showUnpublishModal, setShowUnpublishModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

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

  const { data: companyData, isLoading: isLoadingCompanyInfo } = useQuery({
    queryKey: ["company", parseInt(form?.companyId as string)],
    queryFn: services.getCompanyById(Number(form?.companyId)),
    enabled: Boolean(form?.companyId),
  });

  const { data: formStatusCount } = useQuery({
    queryKey: ["Get forms status count"],
    queryFn: services.getFormStatusCountById(Number(formID)),
  });

  // scroll to top
  useEffect(() => {
    typeof window !== "undefined" && window.scrollTo(0, 0);
  }, []);

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
      <div className="">
        {/* HEADER */}
        <div className="flex items-center justify-between px-5">
          <div>
            <h3 className="text-xl font-semibold">
              <span className="font-light text-gray-500">Forms / </span>
              {form?.name}
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

            {!Boolean(form?.companyId) && (
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
              tenantId={companyData?.company_identifier}
              showUnpublishModal={showUnpublishModal}
              setShowUnpublishModal={setShowUnpublishModal}
              formID={form?.id}
            />
          </div>
        </div>

        <div className="px-10 py-10">
          {/* company assigned */}
          {companyData && (
            <p className="font-semibold mb-5">Company Assigned</p>
          )}
          {isLoadingCompanyInfo ? (
            <div className="bg-gray-200 rounded-lg p-5 animate-pulse h-28"></div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-5">
              {companyData === null ||
              form?.companyId === null ||
              form?.companyId === 0 ? (
                <div className="flex gap-4 items-center">
                  <div className="rounded-full bg-gray-100 p-4 w-24 h-24 flex items-center justify-center">
                    {" "}
                    <VscEmptyWindow size={40} />
                  </div>
                  <div>
                    <p className="text-lg font-semibold"> Unassigned Form</p>
                    <p className="mb-4">Assign a company to form</p>
                    <button
                      onClick={() => setShowAssignModal(true)}
                      className="btn-outline"
                    >
                      <VscLink /> Assign Company
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-5">
                    {companyData?.company_logo?.length < 10 ? (
                      <div className="rounded-full w-20 h-20 flex items-center justify-center object-cover border bg-gray-50 border-[rgba(226, 232, 240, 1)]">
                        <RiImageCircleLine size={40} />
                      </div>
                    ) : (
                      <Image
                        // @ts-ignore
                        src={companyData?.company_logo}
                        width={144}
                        height={144}
                        className="rounded-full w-20 h-20 object-cover border border-[rgba(226, 232, 240, 1)]"
                        alt="Company Logo"
                      />
                    )}
                    {/* @ts-ignore */}
                    {companyData?.company_name && (
                      <div className="flex flex-col gap-0">
                        <div className="text-xl  font-bold">
                          {/* @ts-ignore */}
                          {companyData?.company_name}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* statistics */}
          <div className="mt-10">
            <p className="font-semibold mb-5">Submission Statistics</p>
            <StatsBlock
              stats={[
                {
                  label: "Total number of entries",
                  value: formStatusCount?.totalCount,
                },
                {
                  label: "Completed submissions",
                  value: formStatusCount?.completedCount,
                },
                {
                  label: "Incompleted submissions",
                  value: formStatusCount?.unCompletedCount,
                },
              ]}
            />
          </div>
        </div>

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
