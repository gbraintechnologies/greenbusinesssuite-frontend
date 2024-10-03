"use client";

import React, { useEffect, useState } from "react";

import DataTable from "@/components/DataTable/DataTable";
import SearchBox from "@/components/SearchBox/SearchBox";

import Link from "next/link";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";

import { BsThreeDots } from "react-icons/bs";

import UserIcon from "@/public/icons/UserIcon";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";

import useCompany from "@/hooks/useCompany";
import { IFilter, TimelineType, TimelineValues } from "@/types";
import DatePicker from "@/components/DatePicker/DatePicker";
import ItemsPerPageSelector from "@/components/Pagination/ItemsPerPageSelector";
import Pagination from "@/components/Pagination/Pagination";
import Tabs from "@/components/Tabs/Tabs";
import { TbMessage } from "react-icons/tb";

function Page() {
  const { companyBranding: company,  } = useCompany();


  const [rows, setRows] = useState<{ id: number | undefined; data: any }[]>([]);

  const [page, setPage] = useState(0);

  const [limit, setLimit] = useState(10);

  const [notificationsLoading, setNotificationsLoading] = useState<boolean>(false);

  const [selectedTimeline, setSelectedTimeline] = useState<
    { label: TimelineValues; value: TimelineType } | undefined
  >();

  const filters: IFilter[] = [
    {
      id: 0,
      name: "Message History",
      value: "message_history",
    },
    {
      id: 1,
      name: "Recurring Messages",
      value: "recurring_messages",
    }
  ];

  const [activeFilter, setActiveFilter] = useState<IFilter>({
    id: 0,
    name: "SMS",
    value: "sms",
  });

  const {
    data: customers,
    isLoading,
  } = useQuery({
    queryKey: ["all customers", company?.id, page, limit, selectedTimeline?.value],
    queryFn: services.companyCustomersWithFormCount(
      company?.id,
      page,
      limit,
      selectedTimeline?.value
    ),
    select: (data) => data?.userFormStatList,
  });


  const columns = [
    {
      field: "date",
      headerName: "Date",
      type: "actions",
      align: "left",
      headerAlign: "left",
      flex: 1,
      getActions: (params: any) => [
        <div>{params.row.date}</div>,
      ],
    },

    {
      field: "Subject",
      headerName: "Subject",
      flex: 2,
      type: "actions",
      getActions: (params: any) => [
        <div key={params.row.id} className="w-2/12">
          {params.row.count}
        </div>,
      ],
    },
    {
        field: "Recipients",
        headerName: "Recipients",
        flex: 2,
        type: "actions",
        getActions: (params: any) => [
          <div key={params.row.id} className="w-2/12">
            {params.row.count}
          </div>,
        ],
      },
      {
        field: "Type",
        headerName: "Type",
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
        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered">
              {" "}
              <BsThreeDots size={20} />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            className="shadow-md bg-white border border-[#F1F5F9]  -mt-4 rounded-lg flex flex-col gap-3"
            aria-label="Static Actions"
          >
            <DropdownItem
              key="view"
              className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
            >
              <Link
                href={
                  `/${company?.company_identifier}/admin/customers/profile?id=` +
                  params.row.data.id
                }
              >
                View User
              </Link>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>,
      ],
    },
  ];

  return (
    <div className="w-full pb-20 mt-4 py-2 ">
        <h3 className="px-5 text-xl font-semibold mb-3">Notifications Center</h3>
      <div className="flex items-center px-5 justify-end my-4">
        <div className="flex gap-3  items-center">
        <Link href={`/${company?.company_identifier}/notifications-center/send-message`}>
          <button className=" bg-white text-[#334155] border border-[rgba(226, 232, 240, 1)] w-auto flex text-sm px-2 font-medium py-2 hover:opacity-95 items-center justify-center gap-2 rounded-lg ">
            <TbMessage color={"#334155"} size={20} />
            Send Message
          </button>
        </Link>
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
            currentData={customers}
          />
        </div>
      </div>
      <div className="flex justify-center my-2 mb-2  ">
            <Tabs
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              filters={filters}
            />
          </div>
      <DataTable isLoading={isLoading || notificationsLoading} rows={rows} columns={columns} />
    </div>
  );
}

export default Page;
