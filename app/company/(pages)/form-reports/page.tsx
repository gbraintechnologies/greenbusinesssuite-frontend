"use client";
import React, { use, useEffect, useState } from "react";
import Nav from "../forms/components/Nav";

import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import useAdmin from "@/hooks/useAdmin";

import { useRouter } from "next/navigation";
import StatsBlock from "@/components/StatsBlock/StatsBlock";

function CompanyFormReports() {
  const [searchTerm, setSearchTerm] = useState("");

  const { admin } = useAdmin();

  const { data: companyData } = useQuery({
    queryKey: ["get company"],
    // queryFn: services.getCompanyById(Number(
    //   admin?.custom_profile_values.find(
    //     (item: any) => item.custom_profile_item_id === 2
    //   )?.value)),
    queryFn: services.getCompanyById(2),
  });

  const { data: forms, isLoading: isFormsLoading } = useQuery({
    queryKey: ["get company forms"],
    queryFn: services.getFormsByCompanyName(companyData?.company_name),
    enabled: !!companyData?.company_name,
  });

  return (
    <div className="px-5 pb-20 mt-4 py-2 min-h-screen">
      <Nav headerLeftTitle="Form Reports" />
      <div className="mt-4">
        <StatsBlock
          stats={[
            {
              label: "No. of Links Opened",
              value: "5,468",
            },
            {
              label: "Ignored Links",
              value: "23",
            },
            {
              label: "New Customers",
              value: "145",
            },
          ]}
        />
      </div>
      <div className="mt-4">
        <StatsBlock
          stats={[
            {
              label: "Total Number Of Entries",
              value: "5,468",
            },
            {
              label: "Completed Submissions",
              value: "23",
            },
            {
              label: "Uncompleted Submissions",
              value: "145",
            },
          ]}
        />
      </div>
    </div>
  );
}

export default CompanyFormReports;
