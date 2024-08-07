"use client";

import React, { useEffect, useState } from "react";

// services
import services from "@/services";
import { useQuery } from "@tanstack/react-query";

import { toast } from "sonner";

// icons
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import { VscLink } from "react-icons/vsc";
import Tabs from "@/components/Tabs/Tabs";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ResponseDataTable from "../components/ResponseTable/ResponseDataTable";
import StatsBlock from "@/components/StatsBlock/StatsBlock";
import PublishFormButton from "@/app/(admin)/(pages)/forms/builder/PublishFormButton";
import Analytics from "./_analytics/Analytics";
import { useQueryState } from "nuqs";
import { IFilter } from "@/types";
import DatePicker from "@/components/DatePicker/DatePicker";
import Pagination from "@/components/Pagination/Pagination";
import ItemsPerPageSelector from "@/components/Pagination/ItemsPerPageSelector";

function SingleFormCompany({ params }: any) {
  const [filters, setFilters] = useState([
    { id: 0, name: "Insights", value: "insights" },
    { id: 1, name: "Responses", value: "responses" },
  ]);

  const [activeFilterId, setActiveFilterId] = useQueryState("tab", {
    parse: Number,
    serialize: String,
    defaultValue: 0,
  });

  const [activeFilter, setActiveFilter] = useState(
    filters.find((filter) => filter.id === activeFilterId) || filters[0]
  );

  const [responseData, setResponseData] = useState<any>([]);

  const [selectedTimeline, setSelectedTimeline] = useState<any>();

  const [page, setPage] = useState(0);

  const [limit, setLimit] = useState(20);

  const handleTabChange = (filter: IFilter) => {
    setActiveFilter(filter);
    setActiveFilterId(filter.id);
  };

  //

  let formID = params.formId;

  //
  const [showUnpublishModal, setShowUnpublishModal] = useState(false);

  const { data: form, isLoading } = useQuery({
    queryKey: ["form", parseInt(formID)],
    queryFn: services.getFormByIdDefault(formID),
    enabled: Boolean(formID),
  });

  const { data: companies } = useQuery({
    queryKey: ["all companies"],
    queryFn: services.getAllCompanies(),
  });

  const {
    data: formResponseData,
    isLoading: isResponseLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "get form response by ",
      Number(formID),
      page,
      limit,
      selectedTimeline?.value,
    ],
    queryFn: services.getFormResponseById(
      Number(formID),
      page,
      limit,
      selectedTimeline?.value
    ),
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

  useEffect(() => {
    refetch();
  }, [page, selectedTimeline]);

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

            <PublishFormButton
              showUnpublishModal={showUnpublishModal}
              setShowUnpublishModal={setShowUnpublishModal}
              companies={companies}
              formID={form?.id}
            />
          </div>
        </div>

        <div className="mb-5 text-[#475569]">{form?.description}</div>

        <div
          className={
            " mt-5 " +
            (activeFilter.id === 0
              ? "flex flex-col gap-5"
              : "flex justify-between items-center")
          }
        >
          <Tabs
            filters={filters}
            activeFilter={activeFilter}
            setActiveFilter={handleTabChange}
          />
          {activeFilter.id == 1 ? (
            <div className="flex gap-3 items-center">
              <DatePicker
                selectedTimeline={selectedTimeline}
                setSelectedTimeline={setSelectedTimeline}
              />
              <ItemsPerPageSelector limit={limit} setLimit={setLimit} />
              <Pagination
                page={page}
                variant="no-text"
                setPage={setPage}
                limit={limit}
                currentData={formResponseData?.content}
              />
            </div>
          ) : (
            <></>
            // <DatePicker />
          )}
        </div>
        {activeFilter.id == 0 && (
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
        {activeFilter.id == 0 && <Analytics formID={formID} />}
        {activeFilter.id == 1 && (
          <div className="mt-4">
            <ResponseDataTable
              responseData={formResponseData?.content}
              isResponseLoading={isResponseLoading}
              exportToExcel={exportToExcel}
              form={form}
            />
          </div>
        )}
      </div>
    );
  }
}

export default SingleFormCompany;
