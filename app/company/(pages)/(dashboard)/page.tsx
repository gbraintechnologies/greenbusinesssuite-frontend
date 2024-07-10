"use client";

import React from "react";

import StatsBlock from "@/components/StatsBlock/StatsBlock";

//
import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import useCompany from "@/hooks/useCompany";

function CompanyDashboard() {
  //
  const { company } = useCompany();

  // reports
  const { data: uniqueUsersCount } = useQuery({
    queryKey: ["unique users count", company?.id],
    queryFn: services.uniqueUsersCount(company?.id),
  });

  const { data: totalEntries } = useQuery({
    queryKey: ["total entries per company", company?.id],
    queryFn: services.totalEntries(company?.id),
  });

  const { data: formStats } = useQuery({
    queryKey: ["form stats completed/incompleted", company?.id],
    queryFn: services.companyFormStats(company?.id),
  });

  return (
    <div className="px-5 pb-20 mt-5">
      <div className="text-slate-900 font-semibold text-xl mb-5">Dashboard</div>
      <StatsBlock
        stats={[
          {
            label: "Number of Registrations",
            value: totalEntries !== null ? totalEntries : "-",
          },
          {
            label: "Submitted Applications",
            value: formStats?.completedForms,
          },
          {
            label: "Active Users",
            value: uniqueUsersCount !== null ? uniqueUsersCount : "-",
          },
        ]}
      />
      {/* <div className="flex gap-5 flex-wrap">
        {data.map((item: any, index: number) => (
          <DashboardCard header={item.header} value={item.value} key={index} />
        ))}
      </div> */}
    </div>
  );
}

export default CompanyDashboard;
