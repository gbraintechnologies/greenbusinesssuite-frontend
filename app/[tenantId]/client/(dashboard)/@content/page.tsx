"use client";
import React, { useEffect, useState } from "react";

//
import Tabs from "@/components/Tabs/Tabs";

//
import CompletedForms from "../components/CompletedForms";
import UnCompletedForms from "../components/UncompletedForms";
import UncompletedCard from "../components/UncompletedCard";

//
import StatsBlock from "@/components/StatsBlock/StatsBlock";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";

//
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import useClientForm from "@/hooks/useClientForm";
import useUser from "@/hooks/useUser";
import SuspendedNotice from "../components/SuspendedNotice";
import mergeForm from "@/utils/MergeFormFields/MergeFormFields";
import AllCompanyForms from "../components/AllCompanyForms";

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

  // const { data: allUserForms, isLoading: allUserFormsLoading } = useQuery({
  //   queryKey: ["all user forms", user?.id],
  //   queryFn: services.getAllFormsByUserId(user?.id),
  //   enabled: Boolean(user?.id),
  // });

  const {
    data: uncompletedFormsIds,
    isLoading: areUncompletedFormsIdsLoading,
    refetch: refetchUncompleted,
  } = useQuery({
    queryKey: ["get uncompleted forms id", user?.id],
    queryFn: services.getUncompletedFormIdsByUserId(user?.id),
    enabled: Boolean(user?.id),
  });

  const {
    data: completedFormsIds,
    isLoading: areCompletedFormsIdLoading,
    refetch,
  } = useQuery({
    queryKey: ["get completed forms by user", user?.id],
    queryFn: services.getCompletedFormIdsByUserId(user?.id),
    enabled: Boolean(user?.id),
  });

  const [completedForms, setCompletedForms] = useState([]);
  const [uncompletedForms, setUncompletedForms] = useState([]);

  const [completedFormsLoading, setCompletedFormsLoading] = useState(false);

  const [uncompletedFormsLoading, setUncompletedFormsLoading] = useState(false);

  async function getResponseForForm(id: number, type: string) {
    let form = await services.getFormByIdRawForUser(id);
    let response = await services.retrieveFormUserResponseRaw(user?.id, id);

    let newForm = mergeForm(
      response[0]?.id,
      form?.data,
      response[0]?.inputData
    );

    if (type === "completed") {
      setCompletedForms((prev: any) => {
        if (!prev.some((f: any) => f.id === newForm.id)) {
          return [...prev, newForm];
        }
        return prev;
      });
    } else {
      setUncompletedForms((prev: any) => {
        if (!prev.some((f: any) => f.id === newForm.id)) {
          return [...prev, newForm];
        }
        return prev;
      });
    }
  }

  // completed forms ids processing
  useEffect(() => {
    if (completedFormsIds) {
      setCompletedForms([]);
      setCompletedFormsLoading(true);

      // Create a new array for completed forms
      const formsPromises = completedFormsIds.map((id: any) =>
        getResponseForForm(id, "completed")
      );

      Promise.all(formsPromises).finally(() => {
        setCompletedFormsLoading(false);
      });
    }
  }, [completedFormsIds]);

  useEffect(() => {
    if (uncompletedFormsIds) {
      setUncompletedForms([]);

      setUncompletedFormsLoading(true);

      // Create a new array for completed forms
      const formsPromises = uncompletedFormsIds.map((id: any) =>
        getResponseForForm(id, "uncompleted")
      );

      Promise.all(formsPromises).finally(() => {
        setUncompletedFormsLoading(false);
      });
    }
  }, [completedFormsIds]);

  useEffect(() => {
    // Deselect any active form
    setCompletedForms([]);
    setUncompletedForms([]);
    removeClientForm();
    refetch();
    refetchUncompleted();
    // window.location.reload();
  }, []);

  useEffect(() => {
    setUserStatus(user?.user_status);
  }, [user]);

  return areStatsLoading ? (
    <div className="flex justify-center items-center h-screen w-screen">
      <LoadingIcon />
    </div>
  ) : (
    <div className="px-5 pb-20 pt-5 min-h-screen bg-[#F8FAFC]">
      <div className="text-slate-900 font-semibold text-xl mb-2">Services</div>

      <div className="mt-4 grid grid-col-1 gap-3">
        {uncompletedFormsIds &&
          uncompletedForms?.map((form: any) => {
            return <UncompletedCard key={form?.id} form={form} />;
          })}
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
          {activeFilter.id === 0 && <AllCompanyForms />}
          {activeFilter.id === 1 && (
            <CompletedForms
              forms={completedForms}
              isFormsLoading={
                areCompletedFormsIdLoading || completedFormsLoading
              }
            />
          )}
          {activeFilter.id === 2 && (
            <UnCompletedForms
              forms={uncompletedForms}
              isFormsLoading={
                areUncompletedFormsIdsLoading || uncompletedFormsLoading
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
