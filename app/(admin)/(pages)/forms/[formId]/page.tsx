"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

import { VscEmptyWindow } from "react-icons/vsc";

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
import CompanyBrandAvatar from "@/components/CompanyBrand/CompanyBrandAvatar";

// toast
import { toast } from "sonner";
import StatsBlock from "@/components/StatsBlock/StatsBlock";
import { CompanyType } from "@/types";

function FormDetail(props: any) {
  const params: any = use(props.params);
  let formID = params.formId;

  const [showUnpublishModal, setShowUnpublishModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: form, isLoading } = useQuery({
    queryKey: ["form", parseInt(formID)],
    queryFn: services.getFormById(formID),
    enabled: Boolean(formID),
  });

  const { data: companyData, isLoading: isLoadingCompanyInfo } =
    useQuery<CompanyType>({
      queryKey: ["company", parseInt(form?.companyId as string)],
      queryFn: services.getCompanyById(Number(form?.companyId)),
      enabled: Boolean(form?.companyId),
    });

  const { data: formStatusCount } = useQuery({
    queryKey: ["Get forms status count"],
    queryFn: services.getFormStatusCountById(Number(formID)),
  });

  useEffect(() => {
    typeof window !== "undefined" && window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[20rem] items-center justify-center">
        <div>
          <LoadingIcon />
          <p className="mt-2 text-xs text-gray-500">Fetching form details</p>
        </div>
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className="px-3 pb-20 pt-2 sm:px-5">
      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-400 sm:hidden">Forms</p>
          <h3 className="break-words text-lg font-semibold text-slate-900 sm:text-xl">
            <span className="hidden font-light text-gray-500 sm:inline">
              Forms /{" "}
            </span>
            {form?.name}
          </h3>
        </div>

        <div className="-mx-1 overflow-x-auto no-scrollbar px-1 sm:mx-0 sm:overflow-visible sm:px-0">
          <div className="flex w-max items-center gap-2 sm:w-auto sm:flex-wrap sm:justify-end">
            {Boolean(form?.url) && (
              <button
                type="button"
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
                className="btn-outline shrink-0 whitespace-nowrap text-xs sm:text-sm"
              >
                <VscLink /> Copy Form Link
              </button>
            )}

            {!Boolean(form?.companyId) && (
              <button
                type="button"
                onClick={() => setShowAssignModal(true)}
                className="btn-outline shrink-0 whitespace-nowrap text-xs sm:text-sm"
              >
                <VscLink /> Assign Form
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                router.push(`/forms/builder/${formID}`);
              }}
              className="btn-outline shrink-0 whitespace-nowrap text-xs sm:text-sm"
            >
              <FiEdit2 />
              Edit form
            </button>

            <PublishFormButton
              tenantId={companyData?.companyIdentifier!}
              showUnpublishModal={showUnpublishModal}
              setShowUnpublishModal={setShowUnpublishModal}
              formID={form?.id}
            />
          </div>
        </div>
      </div>

      <div className="mt-5 sm:mt-8 sm:px-5">
        {/* company assigned */}
        {companyData && (
          <p className="mb-3 text-sm font-semibold text-slate-900 sm:mb-5 sm:text-base">
            Company Assigned
          </p>
        )}
        {isLoadingCompanyInfo ? (
          <div className="h-24 animate-pulse rounded-xl bg-gray-200 sm:h-28 sm:rounded-lg sm:p-5" />
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-lg sm:border-0 sm:bg-gray-50 sm:p-5 sm:shadow-none">
            {companyData === null ||
            form?.companyId === null ||
            form?.companyId === 0 ? (
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gray-100 sm:h-24 sm:w-24 sm:p-4">
                  <VscEmptyWindow size={32} className="sm:hidden" />
                  <VscEmptyWindow size={40} className="hidden sm:block" />
                </div>
                <div className="min-w-0">
                  <p className="text-base font-semibold sm:text-lg">
                    Unassigned Form
                  </p>
                  <p className="mb-3 text-sm text-slate-500 sm:mb-4">
                    Assign a company to form
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowAssignModal(true)}
                    className="btn-outline"
                  >
                    <VscLink /> Assign Company
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 sm:gap-5">
                <CompanyBrandAvatar
                  logoUrl={companyData?.companyLogo}
                  name={companyData?.companyName}
                  size="md"
                  shape="circle"
                />
                {companyData?.companyName && (
                  <div className="min-w-0">
                    <p className="truncate text-base font-bold text-slate-900 sm:text-xl">
                      {companyData.companyName}
                    </p>
                    {companyData?.companyIdentifier && (
                      <p className="mt-0.5 truncate text-xs text-slate-400">
                        {companyData.companyIdentifier}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* statistics */}
        <div className="mt-6 sm:mt-10">
          <p className="mb-3 text-sm font-semibold text-slate-900 sm:mb-5 sm:text-base">
            Submission Statistics
          </p>
          <StatsBlock
            stats={[
              {
                label: "Total number of entries",
                value: formStatusCount?.totalCount ?? 0,
              },
              {
                label: "Completed submissions",
                value: formStatusCount?.completedCount ?? 0,
              },
              {
                label: "Submissions",
                value: formStatusCount?.unCompletedCount ?? 0,
              },
            ]}
          />
        </div>
      </div>

      <Modal
        isOpen={showAssignModal}
        setIsOpen={setShowAssignModal}
        title={`Assign company to form `}
      >
        <AssignForm
          id={formID}
          setShow={setShowAssignModal}
          queryClient={queryClient}
        />
      </Modal>
    </div>
  );
}

export default FormDetail;
