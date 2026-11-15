"use client";

import React, { useEffect, useState } from "react";
import Tabs from "@/components/Tabs/Tabs";
import CompletedForms from "../(dashboard)/components/CompletedForms";
import UnCompletedForms from "../(dashboard)/components/UncompletedForms";
import UncompletedCard from "../(dashboard)/components/UncompletedCard";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import StatsBlock from "@/components/StatsBlock/StatsBlock";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import useClientForm from "@/hooks/useClientForm";
import useUser from "@/hooks/useUser";
import AllCompanyForms from "../(dashboard)/components/AllCompanyForms";
import { SlArrowDown } from "react-icons/sl";

const Page = () => {
  const [filters] = useState([
    {
      id: 0,
      name: "All Services",
      value: "all",
    },
    {
      id: 1,
      name: "Complete Applications",
      value: "completed",
    },
    {
      id: 2,
      name: "Incomplete Applications",
      value: "uncompleted",
    },
  ]);

  const { removeClientForm } = useClientForm();
  const [parent] = useAutoAnimate();
  const { user } = useUser();
  const [showAllUncomplete, setShowAllUncomplete] = useState(false);
  const [activeFilter, setActiveFilter] = useState({
    id: 0,
    name: "All Services",
    value: "all",
  });

  useEffect(() => {
    removeClientForm();
  }, []);

  const { data: formsStats, isLoading: areStatsLoading } = useQuery({
    queryKey: ["get forms statistics for user", user?.id],
    queryFn: services.getFormStatisticsForUser(user?.id),
    enabled: Boolean(user?.id),
  });

  const {
    data: completedFormResponses,
    isLoading: completedFormResponsesLoading,
  } = useQuery({
    queryKey: ["user completed forms", user?.id],
    queryFn: services.getUserCompletedForms(user?.id),
    enabled: Boolean(user?.id),
  });

  const {
    data: uncompletedFormResponses,
    isLoading: uncompletedFormResponsesLoading,
  } = useQuery({
    queryKey: ["user uncompleted forms", user?.id],
    queryFn: services.getUserUncompletedForms(user?.id),
    enabled: Boolean(user?.id),
  });

  return areStatsLoading ? (
    <div className="flex h-screen w-screen items-center justify-center">
      <LoadingIcon />
    </div>
  ) : (
    <div ref={parent} className="min-h-screen bg-[#F8FAFC] px-5 pb-20 pt-5">
      <div className="mb-2 text-xl font-semibold text-slate-900">Services</div>
      <p className="mb-4 text-sm text-slate-500">
        Company programs and forms you can apply for.
      </p>

      <div ref={parent} className="mt-4 grid grid-col-1 gap-3">
        {uncompletedFormResponses?.length >= 1 && !showAllUncomplete ? (
          <div className="flex flex-col items-center justify-center">
            <UncompletedCard
              key={uncompletedFormResponses[0]?.id}
              form={uncompletedFormResponses[0]}
            />
            {uncompletedFormResponses.length > 1 &&
              !!uncompletedFormResponsesLoading && (
                <button
                  onClick={() => setShowAllUncomplete(!showAllUncomplete)}
                  className="-mt-2 flex w-fit items-center gap-2 rounded-xl border border-gray-100 bg-white px-7 py-2 text-center text-xs font-medium text-gray-600 shadow-xl"
                >
                  <SlArrowDown size={15} />
                </button>
              )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3">
            {uncompletedFormResponses?.map((form: any) => {
              return <UncompletedCard key={form?.id} form={form} />;
            })}
            {uncompletedFormResponses?.length > 1 && (
              <button
                onClick={() => setShowAllUncomplete(!showAllUncomplete)}
                className="-mt-5 flex w-fit items-center gap-2 rounded-xl border border-gray-100 bg-white px-7 py-2 text-center text-xs font-medium text-gray-600 shadow-xl"
              >
                <SlArrowDown className="rotate-180" size={15} />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-6">
        <StatsBlock
          stats={[
            {
              label: "Number of submitted applications",
              value: formsStats?.completedForms,
            },
            {
              label: "Number of incomplete applications",
              value: formsStats?.uncompletedForms,
            },
          ]}
        />
      </div>

      <div className="mt-8">
        <div className="mb-5 text-lg font-semibold text-slate-900">
          Available services
        </div>
        <div className="mt-3">
          <Tabs
            filters={filters}
            setActiveFilter={setActiveFilter}
            activeFilter={activeFilter}
          />
        </div>
        <div className="mt-4">
          {activeFilter.id === 0 && <AllCompanyForms />}

          {activeFilter.id === 1 && (
            <CompletedForms
              forms={completedFormResponses}
              isFormsLoading={completedFormResponsesLoading}
            />
          )}

          {activeFilter.id === 2 && (
            <UnCompletedForms
              forms={uncompletedFormResponses}
              isFormsLoading={uncompletedFormResponsesLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
