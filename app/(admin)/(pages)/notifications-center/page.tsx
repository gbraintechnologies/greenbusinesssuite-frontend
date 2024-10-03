"use client";
import Link from "next/link";
import React, { useState } from "react";
import { TbMessage } from "react-icons/tb";
import Tabs from "../company-setup/components/Tabs";
import DataTable from "@/components/DataTable/DataTable";
import { IFilter, TimelineType, TimelineValues } from "@/types";

function page() {
  const [rows, setRows] = useState<{ id: number | undefined; data: any }[]>([]);

  const [page, setPage] = useState(0);

  const [limit, setLimit] = useState(10);

  const [notificationsLoading, setNotificationsLoading] =
    useState<boolean>(false);

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
    },
  ];

  const [activeFilter, setActiveFilter] = useState<IFilter>({
    id: 0,
    name: "Message History",
    value: "message_history",
  });

  const columns = [
    {
      field: "date",
      headerName: "Date",
      type: "actions",
      align: "left",
      headerAlign: "left",
      flex: 1,
      getActions: (params: any) => [<div>{params.row.date}</div>],
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
      getActions: (params: any) => [<div>Hello world</div>],
    },
  ];
  return (
    <div className="px-5 pb-10">
      <h3 className="font-semibold mb-8 text-xl">Notifications Center</h3>

      <div className="flex w-full justify-end mb-5">
        <Link href="/notifications-center/send-message">
          <button className=" bg-white text-[#334155] border border-[rgba(226, 232, 240, 1)] w-auto flex text-sm px-2 font-medium py-2 hover:opacity-95 items-center justify-center gap-2 rounded-lg ">
            <TbMessage color={"#334155"} size={20} />
            Send Message
          </button>
        </Link>
      </div>

      <div>
        <div className="flex justify-center my-2 mb-2  ">
          <Tabs
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            filters={filters}
          />
        </div>
        <DataTable
          isLoading={notificationsLoading}
          rows={rows}
          columns={columns}
        />
      </div>
    </div>
  );
}

export default page;
