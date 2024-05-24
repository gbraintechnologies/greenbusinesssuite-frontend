"use client";

import React from "react";

// services
import services from "@/services";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

// components
import AnalyticsGrid from "../components/Analytics/AnalyticsGrid";

import toast from "react-hot-toast";

// icons
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import { VscLink } from "react-icons/vsc";

function SingleFormCompany({ params }: any) {
  //
  const router = useRouter();

  let formID = params.formId;

  const queryClient = useQueryClient();

  const { data: form, isLoading } = useQuery({
    queryKey: ["form", parseInt(formID)],
    queryFn: services.getFormById(formID),
    enabled: Boolean(formID),
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

  if (form) {
    return (
      <div className="mt-5">
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
                <VscLink /> Share
              </button>
            )}
          </div>
        </div>

        {/* TODO: SET UP TABS FOR INSIGHTS AND RESPONSES */}
        {/* ANALYTICS */}
        <AnalyticsGrid />
      </div>
    );
  }
}

export default SingleFormCompany;
