"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

// icons
import { FiEdit2 } from "react-icons/fi";
import { VscLink } from "react-icons/vsc";

// services
import { useQuery } from "@tanstack/react-query";
import services from "@/services";

// COMPONENTS
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import PublishFormButton from "../builder/PublishFormButton";

// toast
import { toast } from "sonner";
import StatsBlock from "@/components/StatsBlock/StatsBlock";

function FormDetail(props: any) {
  const params: any = use(props.params);
  let formID = params.formId;

  const [showUnpublishModal, setShowUnpublishModal] = useState(false);

  const router = useRouter();

  const { data: form, isLoading } = useQuery({
    queryKey: ["form", parseInt(formID)],
    queryFn: services.getFormById(formID),
    enabled: Boolean(formID),
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
              tenantId="mesh_suite_db"
              showUnpublishModal={showUnpublishModal}
              setShowUnpublishModal={setShowUnpublishModal}
              formID={form?.id}
            />
          </div>
        </div>
      </div>

      <div className="mt-5 sm:mt-8 sm:px-5">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <p className="text-sm font-semibold text-slate-900">
            Green Business Suite
          </p>
          <p className="mt-1 text-sm text-slate-500">
            This form is a product of the suite. Clients use it from this account.
          </p>
        </div>

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

    </div>
  );
}

export default FormDetail;
