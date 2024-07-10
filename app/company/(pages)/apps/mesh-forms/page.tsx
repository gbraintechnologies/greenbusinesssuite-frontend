"use client";
import React, { use, useEffect, useState } from "react";
import SearchBox from "@/components/SearchBox/SearchBox";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import useAdmin from "@/hooks/useAdmin";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import { useRouter } from "next/navigation";
import Nav from "../components/Nav";
import EmptyList from "@/components/Form/EmptyList";
import FormCard from "@/components/Form/FormCard";
import { lowerCaseNoSpace } from "@/utils/LowerCaseNoSpace/LowerCaseNoSpace";

function CompanyForms() {
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();
  const { admin } = useAdmin();


  const { data: companyData } = useQuery({
    queryKey: ["get company"],
    queryFn: services.getCompanyById(Number(
      admin?.custom_profile_values.find(
        (item: any) => item.custom_profile_item_id === 2
      )?.value)),
  });


  const { data: forms, isLoading: isFormsLoading } = useQuery({
    queryKey: ["get company forms"],
    queryFn: services.getFormsByCompanyId(companyData?.id),
    enabled: !!companyData?.id,
  });


  return (
    <div className="px-5 pb-20 mt-4 py-2">
      <Nav
        headerLeftTitle="Assigned Forms"
        headerRight={
          <SearchBox
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Search"
          />
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
            <div className="h-full">
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
                        addFormResponses={true}
                        onClick={() => router.push(`/company/apps/mesh-forms/response?id=${form.id}`)}
                      />
                    );
                  })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CompanyForms;
