"use client";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";
import Nav from "../../../forms/components/Nav";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import Tabs from "@/components/Tabs/Tabs";
import DatePicker from "../../../forms/components/DatePicker";
import StatsBlock from "../../../forms/components/StatsBlock";
import DownloadIcon from "@/public/icons/DownloadIcon";
import UserShareIcon from "@/public/icons/UserShareIcon";
import PublishIcon from "@/public/icons/PublishIcon";
import ResponseDataTable from "../../../forms/components/ResponseTable/ResponseDataTable";
import AnalyticsGrid from "../../../forms/components/Analytics/AnalyticsGrid";
import WriteIcon from "@/public/icons/WriteIcon";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import { toast } from "sonner";

const Page = () => {
  const [filters, setFilters] = useState([
    { id: 1, name: "Insights", value: "insights" },
    { id: 2, name: "Responses", value: "responses" },
  ]);

  const [activeFilter, setActiveFilter] = useState({
    id: 1,
    name: "Insights",
    value: "insights",
  });

  const searchParams = useSearchParams();

  const id = searchParams.get("id");

  const { data: form, isLoading: isFormsLoading } = useQuery({
    queryKey: ["get form by id"],
    queryFn: services.getFormById(Number(id)),
  });

  const { data: formResponseData, isLoading: isResponseLoading } = useQuery({
    queryKey: ["get form response by id"],
    queryFn: services.getFormResponseById(Number(id)),
  });

  const { data: formStatusCount } = useQuery({
    queryKey: ["Get forms status count"],
    queryFn: services.getFormStatusCountById(Number(id)),
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

  return (
    <Suspense
      fallback={
        <div className="w-full flex justify-center items-center">
          <LoadingIcon />
        </div>
      }
    >
      <div className="px-5 pb-20 bg-[#F8FAFC] pt-4 h-full">
        <Nav
          headerLeft={
            <div className=" text-[#94A3B8] text-xl">
              Forms /
              <span className="text-black text-xl font-semibold pl-1">
                {form?.name}
              </span>
            </div>
          }
          headerRight={
            <div className="flex items-center gap-3">
              <button
                className="flex gap-2 shadow-[0px_2px_2px_0px_rgba(0, 0, 0, 0.04)] bg-white border border-[#E2E8F0] px-4 py-2 items-center rounded-lg"
                onClick={() => {
                  navigator.clipboard.writeText(form?.url ?? "");
                  toast.success("Link copied to clipboard");
                }}
              >
                <UserShareIcon />
                <div className="text-sm">Share</div>
              </button>
              <button className="flex gap-2 shadow-[0px_1px_4px_0px_rgba(30, 41, 59, 0.09)] bg-[#16A34A] px-4 py-2 items-center rounded-lg text-white">
                <PublishIcon />
                <div className="text-sm">Publish</div>
              </button>
            </div>
          }
        />
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
                onClick={() =>
                  exportToExcel(
                    formResponseData?.flatMap((entry: any) => entry.inputData)
                  )
                }
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
        {/* {activeFilter.id == 1 && (
          <div className="mt-4 border border-[#E2E8F0] bg-white  rounded-lg  py-3">
            <div className="flex justify-between items-center border-b px-5 border-[#E2E8F0] pb-4">
              <div className="font-semibold ">Response Analytics</div>
              <button
                className="flex justify-between items-center gap-2 border border-[#E2E8F0] p-2 rounded-lg"
                onClick={() =>
                  exportToExcel(
                    formResponseData?.flatMap((entry: any) => entry.inputData)
                  )
                }
              >
                <DownloadIcon />
                <div className="text-sm">Download responses</div>
              </button>
            </div>
            <AnalyticsGrid />
          </div>
        )} */}
        {activeFilter.id == 2 && (
          <div className="mt-4">
            <ResponseDataTable
              responseData={formResponseData}
              isResponseLoading={isResponseLoading}
              exportToExcel={exportToExcel}
            />
          </div>
        )}
      </div>
    </Suspense>
  );
};

export default Page;
