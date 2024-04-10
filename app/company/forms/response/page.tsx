"use client";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import Nav from "../components/Nav";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import Tabs from "@/components/Tabs/Tabs";
import DatePicker from "../components/DatePicker";
import StatsBlock from "../components/StatsBlock";
import DownloadIcon from "@/public/icons/DownloadIcon";

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

  const {data: formResponseData} = useQuery({
    queryKey: ["get form response by id"],
    queryFn: services.getFormResponseById(Number(id)),
    enabled: activeFilter.value === "Responses"
  })

  const {data: formStatusCount} = useQuery({
    queryKey: ["Get forms status count"],
    queryFn: services.getFormStatusCountById(Number(id))
  })



  return (
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
            <button className="flex gap-2 shadow-lg bg-white border border-[#E2E8F0] px-4 py-2 items-center rounded-lg">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <ellipse
                  cx="8.00016"
                  cy="3.99998"
                  rx="2.66667"
                  ry="2.66667"
                  stroke="#1E293B"
                  stroke-width="1.2"
                />
                <path
                  d="M9.99984 8.88476C9.38222 8.74413 8.7071 8.66669 7.99984 8.66669C5.05432 8.66669 2.6665 10.0098 2.6665 11.6667C2.6665 13.3235 2.6665 14.6667 7.99984 14.6667C11.7915 14.6667 12.8875 13.9878 13.2043 13"
                  stroke="#1E293B"
                  stroke-width="1.2"
                />
                <ellipse
                  cx="12.0002"
                  cy="10.6667"
                  rx="2.66667"
                  ry="2.66667"
                  stroke="#1E293B"
                  stroke-width="1.2"
                />
                <path
                  d="M12 9.77777V11.5555"
                  stroke="#1E293B"
                  stroke-width="1.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M11.1108 10.6667L12.8886 10.6667"
                  stroke="#1E293B"
                  stroke-width="1.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <div className="text-sm">Share</div>
            </button>
            <button className="flex gap-2 shadow-lg bg-[#16A34A] px-4 py-2 items-center rounded-lg text-white">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.19064 12.6667C2.61268 12.6667 1.3335 11.4025 1.3335 9.84314C1.3335 8.28374 2.61268 7.01961 4.19064 7.01961C4.38005 7.01961 4.56516 7.03782 4.74427 7.07258M9.58746 5.35147C9.98464 5.21274 10.4121 5.13726 10.8573 5.13726C11.2938 5.13726 11.7131 5.20979 12.1036 5.34332M4.74427 7.07258C4.59154 6.6652 4.5081 6.22458 4.5081 5.76471C4.5081 3.68552 6.21368 2 8.31762 2C10.2774 2 11.8916 3.46247 12.1036 5.34332M4.74427 7.07258C5.12055 7.14559 5.47035 7.2916 5.77794 7.49507M12.1036 5.34332C13.5955 5.85349 14.6668 7.25408 14.6668 8.90196C14.6668 10.7066 13.3819 12.2147 11.6668 12.5815"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <path
                  d="M7.99984 10.6667V14.6667M7.99984 10.6667L9.33317 12M7.99984 10.6667L6.6665 12"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              <div className="text-sm">Publish</div>
            </button>
          </div>
        }
      />
      {activeFilter.id == 1 && <div className="mb-5 text-[#475569]">{form?.description}</div>}
      <div className={" mt-5 " + (activeFilter.id === 1 ? 'flex flex-col gap-5': 'flex justify-between items-center')}>

      <Tabs
        filters={filters}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        />
        {activeFilter.id == 2 ? <div className="flex gap-3 items-center"><button className="flex justify-between items-center gap-2 border border-[#E2E8F0] p-2 rounded-lg">
            <DownloadIcon />
            <div className="text-sm">Download </div>
          </button>
        <DatePicker />
          </div> : <DatePicker />}
        </div>
      <div className="mt-4">
        <StatsBlock stats={[{label: "Total number of entries", value: formStatusCount?.totalCount}, {label: "Completed submissions", value: formStatusCount?.completedCount}, {label: "Uncompleted submissions", value: formStatusCount?.notCompletedCount}]}/>
      </div>
      <div className="mt-4 border border-[#E2E8F0] bg-white  rounded-lg  py-3">
        <div className="flex justify-between items-center border-b px-5 border-[#E2E8F0] pb-4">
          <div className="font-semibold ">Response Analytics</div>
          <button className="flex justify-between items-center gap-2 border border-[#E2E8F0] p-2 rounded-lg">
            <DownloadIcon />
            <div className="text-sm">Download responses</div>
          </button>
        </div>
        <div className="px-5">
          {JSON.stringify(formStatusCount)}
        </div>
      </div>
    </div>
  );
};

export default Page;
