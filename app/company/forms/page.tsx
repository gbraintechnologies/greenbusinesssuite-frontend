"use client";
import React, { use, useEffect, useState } from "react";
import Nav from "./components/Nav";
import SearchBox from "@/components/SearchBox/SearchBox";
import { getFormsByCompanyName } from "@/services/features/formsService";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import useAdmin from "@/hooks/useAdmin";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import EmptyList from "@/app/(admin)/forms/components/EmptyList";
import FormCard from "@/app/(admin)/forms/components/FormCard";
import { useRouter } from "next/navigation";
import StatsBlock from "@/components/StatsBlock/StatsBlock";

function CompanyForms() {
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();
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
    <div className="px-5 pb-20 mt-4 py-2 bg-[#F8FAFC]">
      <Nav
        headerLeftTitle="Form Reports"
      />
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

export default CompanyForms;
