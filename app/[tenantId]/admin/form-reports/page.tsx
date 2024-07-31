"use client";

import React from "react";
import Nav from "../forms/components/Nav";

//
import { useQuery } from "@tanstack/react-query";
import services from "@/services";

import StatsBlock from "@/components/StatsBlock/StatsBlock";
import useCompany from "@/hooks/useCompany";

function CompanyFormReports() {
  const { companyBranding: company } = useCompany();

  // reports
  const { data: uniqueUsersCount, isLoading } = useQuery({
    queryKey: ["unique users count", company?.id],
    queryFn: services.uniqueUsersCount(company?.id),
  });

  const { data: totalEntries } = useQuery({
    queryKey: ["total entries per company", company?.id],
    queryFn: services.totalEntries(company?.id),
  });

  const { data: linksOpened } = useQuery({
    queryKey: ["links opened per company", company?.id],
    queryFn: services.linksOpened(company?.id),
  });

  const { data: linksIgnored } = useQuery({
    queryKey: ["ignored links per company", company?.id],
    queryFn: services.ignoredLinks(company?.id),
  });

  const { data: formStats } = useQuery({
    queryKey: ["form stats completed/incompleted", company?.id],
    queryFn: services.companyFormStats(company?.id),
  });

  return (
    <div className="px-5 pb-20 mt-4 py-2 min-h-screen">
      <Nav headerLeftTitle="Form Reports" />
      <div className="mt-4">
        <StatsBlock
          stats={[
            {
              label: "Links Opened",
              value: linksOpened !== null ? linksOpened : "-",
            },
            {
              label: "Ignored Links",
              value: linksIgnored !== null ? linksIgnored : "-",
            },
            {
              label: "Total Customers",
              value: uniqueUsersCount !== null ? uniqueUsersCount : "-",
            },
          ]}
        />
      </div>
      <div className="mt-4">
        <StatsBlock
          stats={[
            {
              label: "Total Number Of Entries",
              value: totalEntries !== null ? totalEntries : "-",
            },
            {
              label: "Completed Submissions",
              value: formStats?.completedForms,
            },
            {
              label: "Uncompleted Submissions",
              value: formStats?.uncompletedForms,
            },
          ]}
        />
      </div>
    </div>
  );
}

export default CompanyFormReports;
