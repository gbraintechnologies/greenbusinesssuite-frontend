"use client";
import React, { useState } from "react";

//
import Tabs from "@/components/Tabs/Tabs";

import { useRouter } from "next/navigation";

//
import CompletedForms from "./components/CompletedForms";
import UnCompletedForms from "./components/UncompletedForms";
import UncompletedCard from "./components/UncompletedCard";
import StatsBlock from "@/components/StatsBlock/StatsBlock";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";

const Page = () => {
  const [filters, setFilters] = useState([
    {
      id: 1,
      name: "Completed",
      value: "completed",
    },
    {
      id: 2,
      name: "Uncompleted",
      value: "uncompleted",
    },
  ]);

  const [activeFilter, setActiveFilter] = useState({
    id: 1,
    name: "Completed",
    value: "completed",
  });

  const { data: formsStats, isLoading: areStatsLoading } = useQuery({
    queryKey: ["get forms statistics for user"],
    queryFn: services.getFormStatisticsForUser("1"),
  });

  const { data: uncompletedForms, isLoading: areUncompletedFormsLoading } =
    useQuery({
      queryKey: ["get company forms"],
      queryFn: services.getUncompletedFormsByUserId("1"),
    });

  const { data: completedForms, isLoading: areCompletedFormsLoading } =
    useQuery({
      queryKey: ["get completed forms by user"],
      // TODO: UPDATE AFTER INTEGRATION
      queryFn: services.getCompletedFormsByUserId("1"),
    });
  const router = useRouter();

  return areStatsLoading ? (
    <div className="flex justify-center items-center h-screen w-screen">
      <LoadingIcon />
    </div>
  ) : (
    <div className="px-5 pb-20 mt-5 h-full bg-[#F8FAFC]">
      <div className="text-slate-900 font-semibold text-xl mb-5">Dashboard</div>
      {/* <div className="mt-4">
        <UncompletedCard />
      </div> */}
      <div className="mt-6">
        <StatsBlock
          stats={[
            {
              label: "Number of submitted forms",
              value: completedForms?.data?.length,
            },
            {
              label: "Number of uncompleted forms",
              value: uncompletedForms?.data?.length,
            },
          ]}
        />
      </div>

      {/* My FORMS */}
      <div className="mt-8">
        <div className="text-slate-900 font-semibold text-lg mb-5">
          My forms
        </div>
        <div className="mt-3">
          <Tabs
            filters={filters}
            setActiveFilter={setActiveFilter}
            activeFilter={activeFilter}
          />
        </div>
        <div className="mt-4">
          {activeFilter.id === 1 && (
            <CompletedForms
              forms={completedForms}
              isFormsLoading={areCompletedFormsLoading}
            />
          )}
          {activeFilter.id === 2 && (
            <UnCompletedForms
              forms={uncompletedForms}
              isFormsLoading={areUncompletedFormsLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
