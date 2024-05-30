"use client";

import React, { useState } from "react";

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
import Tabs from "@/components/Tabs/Tabs";
import DatePicker from "../components/DatePicker";
import DownloadIcon from "@/public/icons/DownloadIcon";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ResponseDataTable from "../components/ResponseTable/ResponseDataTable";
import StatsBlock from "@/components/StatsBlock/StatsBlock";

function SingleFormCompany({ params }: any) {
  const [filters, setFilters] = useState([
    { id: 1, name: "Insights", value: "insights" },
    { id: 2, name: "Responses", value: "responses" },
  ]);

  const [activeFilter, setActiveFilter] = useState({
    id: 1,
    name: "Insights",
    value: "insights",
  });
  //
  const router = useRouter();

  let formID = params.formId;

  const queryClient = useQueryClient();

  const { data: form, isLoading } = useQuery({
    queryKey: ["form", parseInt(formID)],
    queryFn: services.getFormById(formID),
    enabled: Boolean(formID),
  });

  const { data: formResponseData, isLoading: isResponseLoading } = useQuery({
    queryKey: ["get form response by ", Number(formID)],
    queryFn: services.getFormResponseById(Number(formID)),
  });

  const { data: formStatusCount } = useQuery({
    queryKey: ["Get forms status count"],
    queryFn: services.getFormStatusCountById(Number(formID)),
  });

  const exportToExcel = (responses: any) => {
    const worksheet = XLSX.utils.json_to_sheet(responses);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(blob, "responses.xlsx");
  };

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
      <div className="px-5 pb-20 bg-[#F8FAFC] pt-4 h-full">
        {/* HEADER */}
        <div className="flex items-center justify-between">
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
        {activeFilter.id == 1 && (
          <div className="mb-5 text-[#475569]">{form?.description}</div>
        )}
        <div
          className={
            " mt-5 " +
            (activeFilter.id === 1
              ? "flex flex-col gap-5"
              : "flex justify-between items-center")
          }
        >
          <Tabs
            filters={filters}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
          {activeFilter.id == 2 ? (
            <div className="flex gap-3 items-center">
              <button
                className="flex justify-between items-center gap-2 border border-[#E2E8F0] p-2 rounded-lg"
                // onClick={() =>
                //   exportToExcel(
                //     formResponseData?.flatMap((entry: any) => entry.inputData)
                //   )
                // }
              >
                <DownloadIcon />
                <div className="text-sm">Download </div>
              </button>
              <DatePicker />
            </div>
          ) : (
            <DatePicker />
          )}
          </div>
          {activeFilter.id == 1 && (
          <div className="mt-4">
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
        )}
        {activeFilter.id == 1 && (
          <div className="mt-4 border border-[#E2E8F0] bg-white  rounded-lg  py-3">
            <div className="flex justify-between items-center border-b px-5 border-[#E2E8F0] pb-4">
              <div className="font-semibold ">Response Analytics</div>
              <button
                className="flex justify-between items-center gap-2 border border-[#E2E8F0] p-2 rounded-lg"
                // onClick={() =>
                //   exportToExcel(
                //     formResponseData?.flatMap((entry: any) => entry.inputData)
                //   )
                // }
              >
                <DownloadIcon />
                <div className="text-sm">Download responses</div>
              </button>
            </div>
            <AnalyticsGrid />
          </div>
        )}
        {activeFilter.id == 2 && (
          <div className="mt-4">
            <ResponseDataTable
              responseData={formResponseData}
              isResponseLoading={isResponseLoading}
              exportToExcel={exportToExcel}
            />
          </div>
        )}
        {/* TODO: SET UP TABS FOR INSIGHTS AND RESPONSES */}
      </div>
    );
  }
}

export default SingleFormCompany;
