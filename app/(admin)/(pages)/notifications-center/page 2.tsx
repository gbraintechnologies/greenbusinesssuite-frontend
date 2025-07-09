"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { TbMessage } from "react-icons/tb";
import DataTable from "@/components/DataTable/DataTable";
import { IFilter, TimelineType, TimelineValues } from "@/types";
import SendMessage from "./_components/SendMessagePrompt";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import services from "@/services";
import ItemsPerPageSelector from "@/components/Pagination/ItemsPerPageSelector";
import Pagination from "@/components/Pagination/Pagination";
import { Modal, ModalContent, useDisclosure } from "@nextui-org/modal";
import EyeIcon from "@/public/icons/EyeIcon";
import Notifications from "./_components/Notifications";
import { FormatDateWithSuffix } from "@/utils/FormatDate/FormatDate";
import RecurringTypeFilter from "./_components/RecurringTypeFilter";
import Tabs from "@/components/Tabs/Tabs";

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
  },[activeFilter])

  const handleSelectAll: any = () => {
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

  // function to invalidate queries
  // const invalidateQueries = () => {
  //   const queryClient = useQueryClient();

  //   if (activeFilter.id === 0) {
  //     queryClient.invalidateQueries({
  //       queryKey: ["all messages", allMessagesPage, allMessagesLimit],
  //     });
  //   } else if (activeFilter.id === 1) {
  //     queryClient.invalidateQueries({
  //       queryKey: ["all recurring messages", recurringMessagesPage, recurringMessagesLimit],
  //     });

  //     if (recurringType) {
  //       queryClient.invalidateQueries({
  //         queryKey: ["all recurring messages by type", recurringMessagesPage, recurringMessagesLimit, recurringType],
  //       });
  //     }
  //   }
  // };

  const messageHistoryColumns = [
    {
      field: "date",
      headerName: "Date",
      type: "actions",
      align: "left",
      headerAlign: "left",
      flex: 2,
      getActions: (params: any) => [
        <div>{FormatDateWithSuffix(params.row.data?.createdOn)}</div>,
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
    <div className="px-5 pb-10">
      <h3 className="font-semibold mb-8 text-xl">Notifications Center</h3>

      <div>
        <div className="flex justify-between items-center my-2 mb-8">
          <Tabs
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            filters={filters}
          />
          <div className={"flex gap-1 items-center"}>
            <SendMessage type="super-admin" />
            <RecurringTypeFilter
              selected={recurringType}
              setSelected={setRecurringType}
              setPage={setRecurringMessagesPage}
              handleSelectAll={handleSelectAll}
              activeFilterId={activeFilter.id}
            />
          </div>
        </div>
        <DataTable
          isLoading={
            isLoading ||
            recurringMessagesLoading ||
            recurringMessagesByTypeLoading
          }
          rows={activeFilter.id == 0 ? messageHistoryRows : recurringRows}
          columns={
            activeFilter.id == 0 ? messageHistoryColumns : recurringColumns
          }
        />

        {/*PAGINATION */}
        <div className="w-full flex justify-between">
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
                onClose={onClose}
                isDisplayMode={true}
                notification={activeNotification}
                // invalidateQueries={invalidateQueries}
              />
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default page;
