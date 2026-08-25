"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { TbMessage } from "react-icons/tb";
//
import Tabs from "@/components/Tabs/Tabs";
import DataTable from "@/components/DataTable/DataTable";
import { IFilter, TimelineType, TimelineValues } from "@/types";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import ItemsPerPageSelector from "@/components/Pagination/ItemsPerPageSelector";
import Pagination from "@/components/Pagination/Pagination";
import { Modal, ModalContent, useDisclosure } from "@heroui/modal";
import EyeIcon from "@/public/icons/EyeIcon";

import { FormatDateWithSuffix } from "@/utils/FormatDate/FormatDate";

// shared components with admin
import Notifications from "@/app/(admin)/(pages)/notifications-center/_components/Notifications";
import SendMessage from "@/app/(admin)/(pages)/notifications-center/_components/SendMessagePrompt";
import RecurringTypeFilter from "@/app/(admin)/(pages)/notifications-center/_components/RecurringTypeFilter";

function page() {
  const [messageHistoryRows, setMessageHistoryRows] = useState<
    { id: number | undefined; data: any }[]
  >([]);

  const [recurringRows, setRecurringRows] = useState<
    { id: number | undefined; data: any }[]
  >([]);

  const [allMessagesPage, setAllMessagesPage] = useState(0);

  const [allMessagesLimit, setAllMessagesLimit] = useState(10);

  const [recurringMessagesPage, setRecurringMessagesPage] = useState(0);

  const [recurringMessagesLimit, setRecurringMessagesLimit] = useState(10);

  const [selectedTimeline, setSelectedTimeline] = useState<
    { label: TimelineValues; value: TimelineType } | undefined
  >();

  const [activeNotification, setActiveNotification] = useState<any>();

  const [recurringType, setRecurringType] = useState<any>();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
    queryKey: ["all messages", allMessagesPage, allMessagesLimit],
    queryFn: services.allPastNotifications(allMessagesPage, allMessagesLimit),
    select: (data) => data?.content,
  });

  const { data: recurringMessages, isLoading: recurringMessagesLoading } =
    useQuery({
      queryKey: [
        "all recurring messages",
        recurringMessagesPage,
        recurringMessagesLimit,
      ],
      queryFn: services.allRecurringNotifications(
        recurringMessagesPage,
        recurringMessagesLimit
      ),
      select: (data) => data?.content,
      enabled: activeFilter.id == 1,
    });

  const {
    data: recurringMessagesByType,
    isLoading: recurringMessagesByTypeLoading,
  } = useQuery({
    queryKey: [
      "all recurring messages by type",
      recurringMessagesPage,
      recurringMessagesLimit,
      recurringType,
    ],
    queryFn: services.getRecurringMessagesByType(
      recurringType,
      recurringMessagesPage,
      recurringMessagesLimit
    ),
    select: (data) => data?.content,
    enabled: recurringType?.length > 0,
  });

  // set messages to rows
  useEffect(() => {
    if (activeFilter?.id == 0) {
      if (messages) {
        setMessageHistoryRows(
          messages.map((message: any) => ({ id: message.id, data: message }))
        );
      }
    }
    if (activeFilter?.id == 1) {
      if (recurringMessages?.length > 0) {
        setRecurringRows(
          recurringMessages.map((message: any) => ({
            id: message.id,
            data: message,
          }))
        );
      }
    }
  }, [messages, activeFilter, recurringMessages]);

  // setting recurring messages by type
  useEffect(() => {
    if (activeFilter.id == 0) {
      if (recurringType?.length > 0 && recurringMessagesByType) {
        setMessageHistoryRows(
          recurringMessagesByType.map((message: any) => ({
            id: message.id,
            data: message,
          }))
        );
      }
    }
    if (activeFilter.id == 1) {
      if (recurringType?.length > 0 && recurringMessagesByType) {
        setRecurringRows(
          recurringMessagesByType.map((message: any) => ({
            id: message.id,
            data: message,
          }))
        );
      }
    }
  }, [recurringType, recurringMessagesByType]);

  //reset filter when tab changes
  useEffect(() => {
    setRecurringType(null);
  }, [activeFilter]);

  const handleSelectAll = () => {
    if (activeFilter.id == 0) {
      if (messages.length > 0) {
        setMessageHistoryRows(
          messages.map((message: any) => ({ id: message.id, data: message }))
        );
      }
    }
    if (activeFilter.id == 1) {
      if (recurringMessages?.length > 0) {
        setRecurringRows(
          recurringMessages.map((message: any) => ({
            id: message.id,
            data: message,
          }))
        );
      }
    }
  };

  const messageHistoryColumns = [
    {
      field: "date",
      headerName: "Date",
      type: "actions",
      align: "left",
      headerAlign: "left",
      flex: 3,
      getActions: (params: any) => [
        <div className="w-full">
          {FormatDateWithSuffix(params.row.data?.createdOn)}
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
          {params.row.data?.totalRecipients}
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
          {params.row.data?.messageType}
        </div>,
      ],
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      type: "actions",
      getActions: (params: any) => [
        <button
          className="outline-none"
          onClick={() => {
            setActiveNotification(params.row.data);
            onOpen();
          }}
        >
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
      flex: 2,
      getActions: (params: any) => [
        <div>
          {FormatDateWithSuffix(params.row.data?.startDate ?? new Date())}
        </div>,
      ],
    },
    {
      field: "endDate",
      headerName: "End Date",
      type: "actions",
      align: "left",
      headerAlign: "left",
      flex: 2,
      getActions: (params: any) => [
        <div>
          {FormatDateWithSuffix(params.row.data?.endDate ?? new Date())}
        </div>,
      ],
    },

    {
      field: "Subject",
      headerName: "Subject",
      flex: 2,
      type: "actions",
      getActions: (params: any) => [
        <div key={params.row.id} className="w-full truncate">
          {params.row.data?.subject}
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
          {params.row.data?.totalRecipients}
        </div>,
      ],
    },
    {
      field: "timesSent",
      headerName: "Times Sent",
      flex: 1,
      type: "actions",
      getActions: (params: any) => [
        <div key={params.row?.id} className="">
          {params.row.data?.timesSent}
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
          {params.row.data?.messageType}
        </div>,
      ],
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      type: "actions",
      getActions: (params: any) => [
        <button
          className="outline-none"
          onClick={() => {
            setActiveNotification(params.row.data);
            onOpen();
          }}
        >
          <EyeIcon />
        </button>,
      ],
    },
  ];

  return (
    <div className="mt-4 px-3 pb-10 sm:mt-8 sm:px-5">
      <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">
            Notifications Center
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Review message history and manage recurring notifications.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <SendMessage type="company-admin" />
          <RecurringTypeFilter
            selected={recurringType}
            setSelected={setRecurringType}
            setPage={setRecurringMessagesPage}
            handleSelectAll={handleSelectAll}
            activeFilterId={activeFilter.id}
          />
        </div>
      </div>

      <div className="mb-4 overflow-x-auto">
        <Tabs
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          filters={filters}
        />
      </div>

      <DataTable
        isLoading={isLoading || recurringMessagesLoading}
        rows={activeFilter.id == 0 ? messageHistoryRows : recurringRows}
        columns={
          activeFilter.id == 0 ? messageHistoryColumns : recurringColumns
        }
      />

      <div className="mt-4 flex w-full flex-col gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
        <ItemsPerPageSelector
          limit={
            activeFilter?.id == 0 ? allMessagesLimit : recurringMessagesLimit
          }
          setLimit={
            activeFilter?.id == 0
              ? setAllMessagesLimit
              : setRecurringMessagesLimit
          }
        />
        <Pagination
          currentData={activeFilter?.id == 0 ? messages : recurringMessages}
          limit={
            activeFilter?.id == 0 ? allMessagesLimit : recurringMessagesLimit
          }
          page={
            activeFilter?.id == 0 ? allMessagesPage : recurringMessagesPage
          }
          setPage={
            activeFilter?.id == 0
              ? setAllMessagesPage
              : setRecurringMessagesPage
          }
        />
      </div>

      {/* MODAL */}
      <Modal
        backdrop="opaque"
        scrollBehavior="inside"
        className="bg-white rounded-xl"
        classNames={{
          backdrop: "bg-black bg-opacity-30",
        }}
        size="5xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent className="bg-white">
          {(onClose) => (
            <>
              <Notifications
                type="company-admin"
                onClose={onClose}
                isDisplayMode={true}
                notification={activeNotification}
              />
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default page;
