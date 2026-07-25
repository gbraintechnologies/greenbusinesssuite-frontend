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
import ItemsPerPageSelector from "@/components/Pagination/ItemsPerPageSelector";

function CompanyForms() {
  const { companyBranding: companyData } = useCompany();

  //pagination
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);

  //timeline
  const [selectedTimeline, setSelectedTimeline] = useState<
    { label: TimelineValues; value: TimelineType } | undefined
  >();

  const { data: forms, isLoading: isFormsLoading } = useQuery({
    queryKey: [
      "get company forms for ",
      Number(companyData?.id),
      page,
      limit,
      selectedTimeline?.value,
    ],
    queryFn: services.getFormsByCompanyId(
      companyData?.id,
      page,
      limit,
      selectedTimeline?.value
    ),
  });

  return (
    <div className="mt-4 min-h-screen px-3 py-2 pb-20 sm:px-5">
      <Nav headerLeftTitle="Assigned Forms" />

      <div className="mt-5">
        {isFormsLoading ? (
          <div className="flex h-[20rem] items-center justify-center">
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
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <DatePicker
                selectedTimeline={selectedTimeline}
                setSelectedTimeline={setSelectedTimeline}
              />
              <div className="flex flex-wrap items-center gap-2">
                <ItemsPerPageSelector limit={limit} setLimit={setLimit} />

                <Pagination
                  limit={limit}
                  variant="no-text"
                  page={page}
                  currentData={forms?.content}
                  setPage={setPage}
                />
              </div>
            </div>
            {forms?.content?.length === 0 ? (
              <div className="">
                <EmptyList />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
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
