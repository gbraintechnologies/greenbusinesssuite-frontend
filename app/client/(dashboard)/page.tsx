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

  const router = useRouter();

  return (
    <div className="px-5 pb-20 mt-5 h-full bg-[#F8FAFC]">
      <div className="text-slate-900 font-semibold text-xl mb-5">Dashboard</div>
      <div className="mt-4">{/* <UncompletedCard /> */}</div>
      <div className="mt-6">
        <StatsBlock
          stats={[
            {
              label: "Number of submitted forms",
              value: 0,
            },
            { label: "Number of uncompleted forms", value: 0 },
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
          {activeFilter.id === 1 && <CompletedForms />}
          {activeFilter.id === 2 && <UnCompletedForms />}
        </div>
      </div>
    </div>
  );
};

export default Page;
