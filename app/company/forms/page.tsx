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
export interface IFilter {
  id: number;
  name: string;
  value: string;
}

function CompanyForms() {
  const [searchTerm, setSearchTerm] = useState("");

  const { admin } = useAdmin()

  const { data: companyData } = useQuery({
    queryKey: ["get company"],
    // queryFn: services.getCompanyById(Number(
    //   admin?.custom_profile_values.find(
    //     (item: any) => item.custom_profile_item_id === 2
    //   )?.value)),
    queryFn: services.getCompanyById(2),
  });

  const {data: forms, isLoading: isFormsLoading} = useQuery({
  queryKey: ["get company forms"],
  queryFn: services.getFormsByCompanyName(companyData?.company_name),
  enabled: !!companyData?.company_name
  })
  
  return (
    <div className="px-5 pb-20">
      <Nav
        headerLeftTitle="Assigned Forms"
        headerRight={
          <SearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Search"/>
        }
      />
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
            <div className="grid grid-cols-4 gap-5">
              {forms &&
                forms?.data?.filter((form: any) => form.isTemplate !== true)
                  ?.map((form: any) => {
                    return <FormCard key={form.id} form={form} />;
                  })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CompanyForms;
