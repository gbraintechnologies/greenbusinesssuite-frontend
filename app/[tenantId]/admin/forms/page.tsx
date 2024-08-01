"use client";

import React, { useState } from "react";
import Nav from "./components/Nav";

import { useQuery } from "@tanstack/react-query";
import services from "@/services";

// components
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import EmptyList from "@/app/(admin)/(pages)/forms/components/EmptyList";

//
import FormCard from "./components/CompanyFormCard";

import useCompany from "@/hooks/useCompany";
import Pagination from "@/components/Pagination/Pagination";
import { TimelineType, TimelineValues } from "@/types";
import DatePicker from "@/components/DatePicker/DatePicker";

function CompanyForms() {
  const { companyAdmin: admin, companyBranding: companyData } = useCompany();

  //pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);

  //timeline
  const [selectedTimeline, setSelectedTimeline] = useState<  { label: TimelineValues; value: TimelineType } | undefined>()

  const { data: forms, isLoading: isFormsLoading } = useQuery({
    queryKey: ["get company forms for ", Number(companyData?.id)],
    queryFn: services.getFormsByCompanyId(companyData?.id, page, limit, selectedTimeline?.value),
    enabled: !!companyData?.id,
  });

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
            {forms?.content?.length === 0 ? (
              <div className="">
                <EmptyList />
              </div>
            ) : (
              <>
                <div className="flex justify-between">
                <DatePicker selectedTimeline={selectedTimeline} setSelectedTimeline={setSelectedTimeline}/>
                  <Pagination
                    limit={limit}
                    variant="no-text"
                    page={page}
                    currentData={forms?.content}
                    setPage={setPage}
                  />
                </div>
                <div className="grid grid-cols-4 gap-5">
                  {forms &&
                    forms?.content?.map((form: any) => {
                      return <FormCard key={form.id} form={form} />;
                    })}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CompanyForms;
