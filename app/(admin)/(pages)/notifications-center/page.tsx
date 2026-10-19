"use client";
import React, { useEffect, useState } from "react";
import DataTable from "@/components/DataTable/DataTable";
import { IFilter, TimelineType, TimelineValues } from "@/types";
import SendMessage from "./_components/SendMessagePrompt";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ConfirmAction from "@/components/Modal/ConfirmAction";
import services from "@/services";
import ItemsPerPageSelector from "@/components/Pagination/ItemsPerPageSelector";
import Pagination from "@/components/Pagination/Pagination";
import { Modal, ModalContent, useDisclosure } from "@heroui/modal";
import EyeIcon from "@/public/icons/EyeIcon";
import Notifications from "./_components/Notifications";
import { FormatDateWithSuffix } from "@/utils/FormatDate/FormatDate";
import RecurringTypeFilter from "./_components/RecurringTypeFilter";
import Tabs from "@/components/Tabs/Tabs";
import { BsTrash } from "react-icons/bs";
import ConfirmModal from "@/components/Modal/Modal";
import DeleteNotification from "./actions/DeleteNotification";

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
  const [notificationToDelete, setNotificationToDelete] = useState<any>(null);

  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [confirmBatchDelete, setConfirmBatchDelete] = useState(false);
  // Remounts the table so its internal selection clears after a batch delete.
  const [tableVersion, setTableVersion] = useState(0);

  const { data: activeNotificationDetails } = useQuery({
    queryKey: ["notification", activeNotification?.id],
    queryFn: services.getNotificationById(Number(activeNotification?.id)),
    enabled: Boolean(activeNotification?.id),
    retry: false,
  });

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
    setSelectedIds([]);
    setTableVersion((v) => v + 1);
  }, [activeFilter]);

  const visibleRows = activeFilter.id == 0 ? messageHistoryRows : recurringRows;

  const handleTableSelection = (keys: any) => {
    if (keys === "all") {
      setSelectedIds(
        visibleRows
          .map((row) => Number(row?.data?.id ?? row?.id))
          .filter((id) => Number.isFinite(id))
      );
      return;
    }
    const ids = Array.from(keys as Set<string>)
      .map((key) => Number(String(key).split("-").pop()))
      .filter((id) => Number.isFinite(id));
    setSelectedIds(ids);
  };

  const deleteSelected = async () => {
    await services.deleteNotificationsBatch(selectedIds);
    setSelectedIds([]);
    setTableVersion((v) => v + 1);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["all messages"] }),
      queryClient.invalidateQueries({ queryKey: ["all recurring messages"] }),
      queryClient.invalidateQueries({
        queryKey: ["all recurring messages by type"],
      }),
    ]);
  };

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
          key={`view-${params.row.id}`}
          type="button"
          className="outline-none"
          onClick={() => {
            setActiveNotification(params.row.data);
            onOpen();
          }}
        >
          <EyeIcon />
        </button>,
        <button
          key={`delete-${params.row.id}`}
          type="button"
          className="ml-2 text-red-500 outline-none hover:text-red-700"
          aria-label="Delete notification"
          onClick={() => setNotificationToDelete(params.row.data)}
        >
          <BsTrash />
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
          key={`view-${params.row.id}`}
          type="button"
          className="outline-none"
          onClick={() => {
            setActiveNotification(params.row.data);
            onOpen();
          }}
        >
          <EyeIcon />
        </button>,
        <button
          key={`delete-${params.row.id}`}
          type="button"
          className="ml-2 text-red-500 outline-none hover:text-red-700"
          aria-label="Delete notification"
          onClick={() => setNotificationToDelete(params.row.data)}
        >
          <BsTrash />
        </button>,
      ],
    },
  ];

  return (
    <div className="px-3 pb-10 sm:px-5">
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

      <div className="mb-4 flex flex-col gap-3 overflow-x-auto sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          filters={filters}
        />
        {selectedIds.length > 0 && (
          <button
            type="button"
            onClick={() => setConfirmBatchDelete(true)}
            className="flex shrink-0 items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
          >
            <BsTrash /> Delete selected ({selectedIds.length})
          </button>
        )}
      </div>

      <DataTable
        key={`notifications-${activeFilter.id}-${tableVersion}`}
        checkboxes
        onSelectionChange={handleTableSelection}
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
                onClose={onClose}
                isDisplayMode={true}
                notification={
                  activeNotificationDetails
                    ? { ...activeNotification, ...activeNotificationDetails }
                    : activeNotification
                }
                // invalidateQueries={invalidateQueries}
              />
            </>
          )}
        </ModalContent>
      </Modal>

      <ConfirmModal
        isOpen={Boolean(notificationToDelete)}
        setIsOpen={(open: boolean) => {
          if (!open) setNotificationToDelete(null);
        }}
        title={`Delete "${notificationToDelete?.subject ?? "notification"}"?`}
      >
        {notificationToDelete && (
          <DeleteNotification
            notificationId={
              notificationToDelete.id ?? notificationToDelete.__originalId
            }
            subject={notificationToDelete.subject}
            setShow={(open: boolean) => {
              if (!open) setNotificationToDelete(null);
            }}
          />
        )}
      </ConfirmModal>

      <ConfirmAction
        isOpen={confirmBatchDelete}
        onClose={() => setConfirmBatchDelete(false)}
        title={`Delete ${selectedIds.length} notification${
          selectedIds.length === 1 ? "" : "s"
        }?`}
        message="The selected notifications will be permanently removed from message history. This action cannot be undone."
        successMessage="Notifications deleted"
        errorMessage="Failed to delete notifications"
        onConfirm={deleteSelected}
      />
    </div>
  );
}

export default page;
