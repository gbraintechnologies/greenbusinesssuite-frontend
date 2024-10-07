"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { TbMessage } from "react-icons/tb";
import Tabs from "../company-setup/components/Tabs";
import DataTable from "@/components/DataTable/DataTable";
import { IFilter, TimelineType, TimelineValues } from "@/types";
import SendMessage from "./_components/SendMessagePrompt";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import ItemsPerPageSelector from "@/components/Pagination/ItemsPerPageSelector";
import Pagination from "@/components/Pagination/Pagination";
import EyeIcon from "@/public/icons/EyeIcon";

function page() {
  const [nonRecurringRows, setNonRecurringRows] = useState<
    { id: number | undefined; data: any }[]
  >([]);

  const [recurringRows, setRecurringRows] = useState<
    { id: number | undefined; data: any }[]
  >([]);

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

  // get past messages
  const { data: messages, isLoading } = useQuery({
    queryKey: ["all messages", page, limit],
    queryFn: services.allPastNotifications(page, limit),
    select: (data) => data?.content,
  });

  // set messages to rows
  useEffect(() => {
    if (messages) {
      setNonRecurringRows(
        messages.map((message: any) => ({ id: message.id, data: message }))
      );
    }
  }, [messages]);

  const nonRecurringColumns = [
    {
      field: "date",
      headerName: "Date",
      type: "actions",
      align: "left",
      headerAlign: "left",
      flex: 1,
      getActions: (params: any) => [
        <div>
          {new Date(params.row.data.triggerDate).toLocaleDateString("en-us", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>,
      ],
    },

    {
      field: "Subject",
      headerName: "Subject",
      flex: 2,
      type: "actions",
      getActions: (params: any) => [
        <div key={params.row.id} className="w-2/12">
          {params.row.data.subject}
        </div>,
      ],
    },
    {
      field: "Recipients",
      headerName: "Recipients",
      flex: 1,
      type: "actions",
      getActions: (params: any) => [
        <div key={params.row.id} className="w-2/12">
          {params.row.data.recipients.length}
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
          {params.row.data.type}
        </div>,
      ],
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      type: "actions",
      getActions: (params: any) => [
        <button className="outline-none">
          <EyeIcon />
        </button>,
      ],
    },
  ];

  const recurringColumns = [
    {
      field: "startDate",
      headerName: "Start Date",
      type: "actions",
      align: "left",
      headerAlign: "left",
      flex: 1,
      getActions: (params: any) => [
        <div>
          {new Date(params.row.data.startDate).toLocaleDateString("en-us", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>,
      ],
    },
    {
      field: "endDate",
      headerName: "End Date",
      type: "actions",
      align: "left",
      headerAlign: "left",
      flex: 1,
      getActions: (params: any) => [
        <div>
          {new Date(params.row.data.endDate).toLocaleDateString("en-us", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>,
      ],
    },

    {
      field: "Subject",
      headerName: "Subject",
      flex: 1,
      type: "actions",
      getActions: (params: any) => [
        <div key={params.row.id} className="w-full truncate">
          {params.row.data.subject}
        </div>,
      ],
    },
    {
      field: "Recipients",
      headerName: "Recipients",
      flex: 1,
      type: "actions",
      getActions: (params: any) => [
        <div key={params.row.id} className="w-2/12">
          {params.row.data.recipients.length}
        </div>,
      ],
    },
    {
      field: "timesSent",
      headerName: "Times Sent",
      flex: 1,
      type: "actions",
      getActions: (params: any) => [
        <div key={params.row.id} className="">
          {params.row.data.timesSent}
        </div>,
      ],
    },
    {
      field: "Type",
      headerName: "Type",
      flex: 1,
      type: "actions",
      getActions: (params: any) => [
        <div key={params.row.id} className="">
          {params.row.data.type}
        </div>,
      ],
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      type: "actions",
      getActions: (params: any) => [
        <button className="outline-none">
          <EyeIcon />
        </button>,
      ],
    },
  ];
  return (
    <div className="px-5 pb-10">
      <h3 className="font-semibold mb-8 text-xl">Notifications Center</h3>

      <div className="flex w-full justify-end mb-5">
        <SendMessage />
      </div>

      <div>
        <div className="flex justify-center my-2 mb-4  ">
          <Tabs
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            filters={filters}
          />
        </div>
        <DataTable
          isLoading={notificationsLoading}
          rows={activeFilter.id == 0 ? nonRecurringRows : recurringRows}
          columns={
            activeFilter.id == 0 ? nonRecurringColumns : recurringColumns
          }
        />
        {/*PAGINATION */}

        <div className="w-full flex justify-between">
          <ItemsPerPageSelector limit={limit} setLimit={setLimit} />
          <Pagination
            currentData={messages}
            limit={limit}
            page={page}
            setPage={setPage}
          />
        </div>
      </div>
    </div>
  );
}

export default page;
