"use client";
import React, { useEffect, useState } from "react";

//
import Tabs from "@/components/Tabs/Tabs";

//
import CompletedForms from "../components/CompletedForms";
import UnCompletedForms from "../components/UncompletedForms";
import UncompletedCard from "../components/UncompletedCard";

//

import { useAutoAnimate } from "@formkit/auto-animate/react";

//
import StatsBlock from "@/components/StatsBlock/StatsBlock";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";

//
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import useClientForm from "@/hooks/useClientForm";
import useUser from "@/hooks/useUser";
import mergeForm from "@/utils/MergeFormFields/MergeFormFields";
import AllCompanyForms from "../components/AllCompanyForms";
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

  //
  const { removeClientForm } = useClientForm();

  // animation
  const [parent] = useAutoAnimate();

  // current client
  const { user } = useUser();

  const [userStatus, setUserStatus] = useState("");

  const [showAllUncomplete, setShowAllUncomplete] = useState(false);

  const [activeFilter, setActiveFilter] = useState({
    id: 1,
    name: "Completed",
    value: "completed",
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
    refetch: refetchCompleted,
  } = useQuery({
    queryKey: ["user completed forms", user?.id],
    queryFn: services.getUserCompletedForms(user?.id),
    enabled: Boolean(user?.id),
  });

  const {
    data: uncompletedFormResponses,
    isLoading: uncompletedFormResponsesLoading,
    refetch: refetchUnCompleted,
  } = useQuery({
    queryKey: ["user uncompleted forms", user?.id],
    queryFn: services.getUserUncompletedForms(user?.id),
    enabled: Boolean(user?.id),
  });

  useEffect(() => {
    setUserStatus(user?.user_status);
  }, [user]);

  return areStatsLoading ? (
    <div className="flex justify-center items-center h-screen w-screen">
      <LoadingIcon />
    </div>
  ) : (
    <div ref={parent} className="px-5 pb-20 pt-5 min-h-screen bg-[#F8FAFC]">
      <div className="text-slate-900 font-semibold text-xl mb-2">Services</div>

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
                  className="text-xs font-medium text-center text-gray-600 flex items-center gap-2 bg-white px-7 -mt-2 shadow-xl border border-gray-100 w-fit py-2 rounded-xl"
                >
                  {" "}
                  <SlArrowDown size={15} />
                </button>
              )}
          </div>
        ) : (
          <div className="flex flex-col gap-3 items-center justify-center">
            {uncompletedFormResponses?.map((form: any) => {
              return <UncompletedCard key={form?.id} form={form} />;
            })}
            {uncompletedFormResponses?.length > 1 && (
              <button
                onClick={() => setShowAllUncomplete(!showAllUncomplete)}
                className="text-xs font-medium text-center text-gray-600 flex items-center gap-2 bg-white px-7 -mt-5 shadow-xl border border-gray-100 w-fit py-2 rounded-xl"
              >
                {" "}
                <SlArrowDown className="rotate-180" size={15} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* STATISTICS */}
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

      {/* My FORMS */}
      <div className="mt-8 ">
        <div className="text-slate-900 font-semibold text-lg mb-5">
          Services
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
