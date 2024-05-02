"use client";
import React, { useState } from "react";
import UncompletedCard from "./components/UncompletedCard";
import StatsBlock from "@/components/StatsBlock/StatsBlock";
import Tabs from "@/components/Tabs/Tabs";
import FormCard from "@/app/(admin)/forms/components/FormCard";
import EmptyList from "@/app/(admin)/forms/components/EmptyList";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import { useRouter } from "next/navigation";

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

  const { data: forms, isLoading: isFormsLoading } = useQuery({
    queryKey: ["get company forms"],
    queryFn: services.getFormsByCompanyName("amazon"),
  });

  const router = useRouter()

  return (
    <div className="px-5 pb-20 mt-5 bg-[#F8FAFC]">
      <div className="text-slate-900 font-semibold text-xl mb-5">Dashboard</div>
      <div className="mt-4">
        <UncompletedCard />
      </div>
      <div className="mt-6">
        <StatsBlock
          stats={[
            {
              label: "Number of submitted forms",
              value: 23,
            },
            { label: "Number of uncompleted forms", value: 143 },
          ]}
        />
      </div>
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
        {isFormsLoading ? (
        <div className="h-[20rem] flex items-center justify-center">
          <div>
            <LoadingIcon />
            <p className="mt-2 text-xs text-gray-500">Fetching all forms</p>
          </div>
        </div>
      ) : (
        // ALL FORMS
        <>
          {forms?.data?.length === 0 ? (
            <div className="">
              <EmptyList />
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-5 mt-5">
              {forms &&
                forms?.data
                  ?.filter((form: any) => form.isTemplate !== true)
                  ?.map((form: any) => {
                    return (
                      <FormCard
                        key={form.id}
                        form={form}
                      />
                    );
                  })}
            </div>
          )}
        </>
      )}
        </div>
      </div>
    </div>
  );
};

export default Page;
