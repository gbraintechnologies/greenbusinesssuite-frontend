"use client";

import React, { useEffect, useState, use } from "react";

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

import DatePicker from "@/components/DatePicker/DatePicker";
import Pagination from "@/components/Pagination/Pagination";
import ItemsPerPageSelector from "@/components/Pagination/ItemsPerPageSelector";
import { IoLockClosedOutline, IoLockOpenOutline } from "react-icons/io5";
import { PiNotePencilBold } from "react-icons/pi";

function SingleFormCompany(props: any) {
  const params: any = use(props.params);
  const [filters, setFilters] = useState([
    { id: 0, name: "Insights", value: "insights" },
    { id: 1, name: "Responses", value: "responses" },
  ]);

  // const [activeFilterId, setActiveFilterId] = useQueryState("tab", {
  //   parse: Number,
  //   serialize: String,
  //   defaultValue: 0,
  // });

  const [activeFilter, setActiveFilter] = useState(filters[0]);

  const [responseData, setResponseData] = useState<any>([]);

  const [selectedTimeline, setSelectedTimeline] = useState<any>();

  const [page, setPage] = useState(0);

  const [limit, setLimit] = useState(20);

  let formID = params.formId;

  //
  const [showUnpublishModal, setShowUnpublishModal] = useState(false);

  const { data: form, isLoading } = useQuery({
    queryKey: ["form", parseInt(formID)],
    queryFn: services.getFormByIdDefault(formID),
    enabled: Boolean(formID),
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
      <div className="px-5 pb-20 bg-[#F8FAFC] pt-4 min-h-[100vh]">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl flex items-center gap-4 font-semibold">
              <span className="font-light text-gray-500">Forms /</span>{" "}
              {form?.name}{" "}
              <span className="text-sm">
                {form?.isAnonymous ? (
                  <span className="rounded-full text-orange-600 bg-orange-600 font-medium bg-opacity-10  py-1 px-4 flex items-center gap-1 w-fit">
                    <IoLockOpenOutline /> Public
                  </span>
                ) : (
                  <span className="rounded-full text-indigo-600 bg-indigo-600 font-medium bg-opacity-10  py-1 px-4 flex items-center gap-1 w-fit">
                    <IoLockClosedOutline /> Protected
                  </span>
                )}
              </span>
              <span className="text-sm">
                {form?.multipleForms && (
                  <span className="rounded-full text-fuchsia-700 bg-fuchsia-600 bg-opacity-10 font-normal py-1 px-4 flex items-center gap-1 w-fit">
                    <PiNotePencilBold /> Allows Multiple Responses
                  </span>
                )}
              </span>
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
              formID={form?.id}
              tenantId={params.tenantId}
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
            setActiveFilter={setActiveFilter}
            // enableQueryState={false}
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
                  label: "Incomplete submissions",
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
