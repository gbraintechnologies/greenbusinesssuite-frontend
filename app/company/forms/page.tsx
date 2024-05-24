"use client";
import React, { useState } from "react";
import Nav from "./components/Nav";

import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import useAdmin from "@/hooks/useAdmin";

// components
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import EmptyList from "@/app/(admin)/forms/components/EmptyList";

//
import FormCard from "./components/CompanyFormCard";

//
import { useRouter } from "next/navigation";

function CompanyForms() {
  const router = useRouter();
  const { admin } = useAdmin();

  const { data: companyData } = useQuery({
    queryKey: ["get company"],

    queryFn: services.getCompanyById(2),
  });

  const { data: forms, isLoading: isFormsLoading } = useQuery({
    queryKey: ["get company forms"],
    queryFn: services.getFormsByCompanyName(companyData?.company_name),
    enabled: !!companyData?.company_name,
  });

  console.log("forms", forms);

  return (
    <div className="px-5 pb-20 mt-4 py-2 min-h-screen">
      <Nav headerLeftTitle="Assigned Forms" />

      <div className="mt-5">
        {isFormsLoading ? (
          <div className="h-[20rem] flex items-center justify-center">
            <div>
              <LoadingIcon />
              <p className="mt-2 text-xs text-gray-500">
                Fetching assigned forms
              </p>
            </div>
          </div>
        ) : (
          // ALL COMPANY FORMS
          <>
            {forms?.length === 0 ? (
              <div className="">
                <EmptyList />
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-5">
                {forms?.map((form: any) => {
                  return <FormCard key={form.id} form={form} />;
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CompanyForms;
