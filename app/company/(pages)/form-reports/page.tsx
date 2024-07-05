"use client";

import React from "react";
import Nav from "../forms/components/Nav";

//
import { useQuery } from "@tanstack/react-query";
import services from "@/services";

import StatsBlock from "@/components/StatsBlock/StatsBlock";
import useCompany from "@/hooks/useCompany";

function CompanyFormReports() {
  const { company } = useCompany();

  // reports
  const { data: uniqueUsersCount, isLoading } = useQuery({
    queryKey: ["unique users count", company?.company_name],
    queryFn: services.uniqueUsersCount(company?.company_name),
  });

  const { data: totalEntries } = useQuery({
    queryKey: ["total entries per company", company?.company_name],
    queryFn: services.totalEntries(company?.company_name),
  });

  const { data: linksOpened } = useQuery({
    queryKey: ["links opened per company", company?.company_name],
    queryFn: services.linksOpened(company?.company_name),
  });

  const { data: linksIgnored } = useQuery({
    queryKey: ["ignored links per company", company?.company_name],
    queryFn: services.ignoredLinks(company?.company_name),
  });

  const { data: formStats } = useQuery({
    queryKey: ["form stats completed/incompleted", company?.company_name],
    queryFn: services.companyFormStats(company?.company_name),
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
