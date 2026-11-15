"use client";

import React, { useEffect, useState } from "react";

import DataTable from "@/components/DataTable/DataTable";

import Link from "next/link";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Button } from "@heroui/react";

import { BsThreeDots } from "react-icons/bs";

import UserIcon from "@/public/icons/UserIcon";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";

import useCompany from "@/hooks/useCompany";
import { TimelineType, TimelineValues } from "@/types";
import DatePicker from "@/components/DatePicker/DatePicker";
import ItemsPerPageSelector from "@/components/Pagination/ItemsPerPageSelector";
import Pagination from "@/components/Pagination/Pagination";

function ServiceRequests() {
  const { companyBranding: company } = useCompany();

  const [rows, setRows] = useState<{ id: number | undefined; data: any }[]>([]);

  const [page, setPage] = useState(0);

  const [limit, setLimit] = useState(10);

  const [requestsLoading, setRequestsLoading] = useState<boolean>(false);

  const [selectedTimeline, setSelectedTimeline] = useState<
    { label: TimelineValues; value: TimelineType } | undefined
  >();

  const { data: serviceRequests, isLoading } = useQuery({
    queryKey: [
      "all service requests",
      company?.id,
      page,
      limit,
      selectedTimeline?.value,
    ],
    queryFn: services.companyCustomersWithFormCount(
      company?.id,
      page,
      limit,
      selectedTimeline?.value
    ),
    select: (data) => data?.userFormStatList,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (serviceRequests) {
        try {
          setRequestsLoading(true);
          const completeRows: any = await Promise.all(
            serviceRequests?.map(async (request: any) => {
              const userRes = await services.userByIDRaw(request?.userId);
              return {
                id: request?.userId,
                count: request?.submitFormsCount,
                data: userRes,
              };
            })
          );
          setRows(completeRows);
        } catch (error) {
          setRows([]);
        } finally {
          setRequestsLoading(false);
        }
      }
    };

    fetchUserData();
  }, [serviceRequests]);

  const columns = [
    {
      field: "name",
      headerName: "Applicant",
      type: "actions",
      align: "left",
      headerAlign: "left",
      flex: 3,
      getActions: (params: any) => [
        <div className="flex py-3 gap-4 my-3" key={params.row.data.id}>
          {params.row.data.custom_profile_values &&
          params.row.data.custom_profile_values.find(
            (item: any) => item.custom_profile_item_id === 1
          )?.value?.length > 1 ? (
            <Image
              alt="profile"
              src={
                params.row.data.custom_profile_values.find(
                  (item: any) => item.custom_profile_item_id === 1
                ).value
              }
              width={100}
              height={100}
              className="rounded-full w-10 h-10 object-cover"
            />
          ) : (
            <div className="bg-gray-100 w-10 h-10 flex items-center justify-center font-light text-sm rounded-full">
              <UserIcon />
            </div>
          )}
          <div>
            <p className="font-medium">
              {params.row.data.first_name} {params.row.data.last_name}
            </p>
            <p className="opacity-80 text-sm">{params.row.data.email}</p>
          </div>
        </div>,
      ],
    },

    {
      field: "status",
      headerName: "Submitted forms",
      flex: 1,
      type: "actions",
      getActions: (params: any) => [
        <div key={params.row.id} className="w-2/12">
          {params.row.count}
        </div>,
      ],
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      type: "actions",
      getActions: (params: any) => [
        <Dropdown key={params.row.id}>
          <DropdownTrigger>
            <Button variant="bordered">
              {" "}
              <BsThreeDots size={20} />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            className="shadow-md bg-white border border-[#F1F5F9]  -mt-4 rounded-lg flex flex-col gap-3"
            aria-label="Service request actions"
          >
            <DropdownItem
              key="view"
              className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
            >
              <Link
                href={
                  `/${company?.company_identifier}/admin/service-requests/profile?id=` +
                  params.row.data.id
                }
              >
                View submissions
              </Link>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>,
      ],
    },
  ];

  return (
    <div className="w-full pb-20 mt-4 py-2 ">
      <div className="flex items-center px-5 justify-between my-4">
        <div>
          <h3 className="px-1 text-xl font-semibold">Service Requests</h3>
          <p className="px-1 mt-1 text-sm text-slate-500">
            Track submitted forms from your clients
          </p>
        </div>
        <div className="flex gap-3  items-center">
          <DatePicker
            selectedTimeline={selectedTimeline}
            setSelectedTimeline={setSelectedTimeline}
          />
          <ItemsPerPageSelector limit={limit} setLimit={setLimit} />
          <Pagination
            page={page}
            variant="no-text"
            setPage={setPage}
            limit={limit}
            currentData={serviceRequests}
          />
        </div>
      </div>
      <DataTable
        isLoading={isLoading || requestsLoading}
        rows={rows}
        columns={columns}
      />
    </div>
  );
}

export default ServiceRequests;
