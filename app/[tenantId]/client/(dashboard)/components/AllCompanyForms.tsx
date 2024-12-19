"use client";

import React, { useState } from "react";

//
import useCompany from "@/hooks/useCompany";
import { useQuery } from "@tanstack/react-query";
import { TimelineType, TimelineValues } from "@/types";
import services from "@/services";
import Pagination from "@/components/Pagination/Pagination";
import ItemsPerPageSelector from "@/components/Pagination/ItemsPerPageSelector";

import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import ServiceCard from "./ServiceCard";

import { IoLaptopOutline } from "react-icons/io5";
import useUser from "@/hooks/useUser";

function AllCompanyForms() {
  const { companyBranding: companyData } = useCompany();

  // current client
  const { user } = useUser();

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

  const {
    data: completedFormsIds,
    isLoading: areCompletedFormsIdLoading,
    refetch,
  } = useQuery({
    queryKey: ["get completed forms by user", user?.id],
    queryFn: services.getCompletedFormIdsByUserId(user?.id),
    enabled: Boolean(user?.id),
  });

  const {
    data: uncompletedFormsIds,
    isLoading: areUncompletedFormsIdsLoading,
    refetch: refetchUncompleted,
  } = useQuery({
    queryKey: ["get uncompleted forms id", user?.id],
    queryFn: services.getUncompletedFormIdsByUserId(user?.id),
    enabled: Boolean(user?.id),
  });

  return (
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
          <div className="flex justify-end mb-3">
            <div className="flex  items-center gap-2">
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
          {forms?.content
            ?.filter((item: any) => !uncompletedFormsIds.includes(item?.id))
            ?.filter((item: any) => !completedFormsIds.includes(item?.id))
            ?.filter((item: any) => item.publishStatus == "PUBLISHED")
            .length === 0 ? (
            <div className="flex items-center justify-center flex-col min-h-[20vh]">
              <IoLaptopOutline size={50} />
              <p className="mt-2 text-lg font-semibold">
                {" "}
                No Available Services
              </p>
              <p className="text-gray-500 max-w-sm mx-auto text-center">
                There are currently no services accepting new applications.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-4 gap-5">
                {forms &&
                  forms?.content
                    ?.filter(
                      (item: any) => !uncompletedFormsIds.includes(item?.id)
                    )
                    ?.filter(
                      (item: any) => !completedFormsIds.includes(item?.id)
                    )
                    ?.filter((item: any) => item.publishStatus == "PUBLISHED")
                    .map((form: any) => {
                      return <ServiceCard key={form.id} form={form} />;
                    })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default AllCompanyForms;
