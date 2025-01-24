"use client";

import React from "react";

import StatsBlock from "@/components/StatsBlock/StatsBlock";

//
import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import useCompany from "@/hooks/useCompany";
import SuspendedNotice from "../components/SuspendedNotice";
import Analytics from "../components/Analytics/Analytics";

function CompanyDashboard() {
  //
  const { companyBranding: company, companyAdmin } = useCompany();

  const [adminStatus, setAdminStatus] = React.useState("");

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

  React.useEffect(() => {
    setAdminStatus(companyAdmin?.user_status);
  }, [companyAdmin]);

  return (
    <div className="px-5 pb-20 mt-5">
      <div className="text-slate-900 font-semibold text-xl mb-5">Dashboard</div>
      {adminStatus == "INACTIVE" && (
        <div>
          <SuspendedNotice />
        </div>
      )}
      <div className="mt-5">
        <StatsBlock
          stats={[
            {
              label: "Number of registrations",
              value: totalEntries !== null ? totalEntries : "-",
            },
            {
              label: "Number of submitted applications",
              value: formStats?.completedForms,
            },
            {
              label: "Total number of active businesses",
              value: formStats?.completedForms,
            },
            {
              label: "Number of active users",
              value: uniqueUsersCount !== null ? uniqueUsersCount : "-",
            },
          ]}
        />
      </div>
      <div>
        <Analytics />
      </div>
      {/* <div className="flex gap-5 flex-wrap">
        {data.map((item: any, index: number) => (
          <DashboardCard header={item.header} value={item.value} key={index} />
        ))}
      </div> */}
    </div>
  );
}

export default CompanyDashboard;
