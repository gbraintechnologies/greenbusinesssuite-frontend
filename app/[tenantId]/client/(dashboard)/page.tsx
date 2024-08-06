"use client";
import React, { useEffect, useState } from "react";

//
import Tabs from "@/components/Tabs/Tabs";

//
import CompletedForms from "./components/CompletedForms";
import UnCompletedForms from "./components/UncompletedForms";
import UncompletedCard from "./components/UncompletedCard";

//
import StatsBlock from "@/components/StatsBlock/StatsBlock";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";

//
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import useClientForm from "@/hooks/useClientForm";
import useUser from "@/hooks/useUser";
import SuspendedNotice from "./components/SuspendedNotice";

const Page = () => {
  const [filters] = useState([
    {
      id: 0,
      name: "All",
      value: "all",
    },
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

  //
  const { removeClientForm } = useClientForm();

  // current client
  const { user } = useUser();

  const [userStatus, setUserStatus] = useState("");

  const [activeFilter, setActiveFilter] = useState({
    id: 1,
    name: "Completed",
    value: "completed",
  });

  const { data: formsStats, isLoading: areStatsLoading } = useQuery({
    queryKey: ["get forms statistics for user", user?.id],
    queryFn: services.getFormStatisticsForUser(user?.id),
    enabled: Boolean(user?.id),
  });

  const { data: uncompletedForms, isLoading: areUncompletedFormsLoading } =
    useQuery({
      queryKey: ["get company forms", user?.id],
      queryFn: services.getUncompletedFormsByUserId(user?.id),
      enabled: Boolean(user?.id),
    });

  const { data: allUserForms, isLoading: allUserFormsLoading } = useQuery({
    queryKey: ["all user forms", user?.id],
    queryFn: services.getAllFormsByUserId(user?.id),
    enabled: Boolean(user?.id),
  });

  const { data: completedForms, isLoading: areCompletedFormsLoading } =
    useQuery({
      queryKey: ["get completed forms by user", user?.id],
      queryFn: services.getCompletedFormsByUserId(user?.id),
      enabled: Boolean(user?.id),
    });

  useEffect(() => {
    // Deselect any active form
    removeClientForm();
  }, []);

  useEffect(() => {
    setUserStatus(user?.user_status);
  }, [user])

  return areStatsLoading ? (
    <div className="flex justify-center items-center h-screen w-screen">
      <LoadingIcon />
    </div>
  ) : (
    <div className="px-5 pb-20 pt-5 min-h-screen bg-[#F8FAFC]">
      <div className="text-slate-900 font-semibold text-xl mb-2">Dashboard</div>

      {userStatus === "INACTIVE" && (
        <div className="mt-4">
          <SuspendedNotice />
        </div>
      )}

      <div className="mt-4 grid grid-col-1 gap-3">
        {uncompletedForms?.map((form: any) => {
          return <UncompletedCard key={form?.id} form={form} />;
        })}
      </div>
      <div className="mt-6">
        <StatsBlock
          stats={[
            {
              label: "Number of submitted forms",
              value: formsStats?.completedForms,
            },
            {
              label: "Number of uncompleted forms",
              value: formsStats?.uncompletedForms,
            },
          ]}
        />
      </div>

      {/* My FORMS */}
      <div className="mt-8 ">
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
          {activeFilter.id === 0 && (
            <CompletedForms
              forms={allUserForms}
              isFormsLoading={allUserFormsLoading}
            />
          )}
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
