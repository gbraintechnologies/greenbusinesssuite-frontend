"use client";

import DataTable from "@/components/DataTable/DataTable";
import services from "@/services";
import { TimelineType } from "@/types";
import { FormatDateShort } from "@/utils/FormatDate/FormatDate";
import { useQuery } from "@tanstack/react-query";

import React, { useState } from "react";

import { VscEye } from "react-icons/vsc";

function InvoiceList({
  setSelectedInvoiceId,
  onOpen,
  timeline = "ALL",
}: {
  setSelectedInvoiceId: (id: string | number) => void;
  onOpen: () => void;
  timeline?: TimelineType;
}) {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);

  const { data: invoices, isLoading } = useQuery({
    queryKey: ["all invoices", page, limit, timeline],
    queryFn: services.getAllInvoices(page, limit, timeline),
  });

  const columns = [
    {
      field: "invoiceNumber",
      headerName: "Invoice Number",
      align: "left",
      headerAlign: "left",
      flex: 1,
    },
    {
      field: "customerName",
      headerName: "CustomerName",
      flex: 1,
    },
    {
      field: "createdOn",
      headerName: "Created On",
      type: "actions",
      flex: 1,
      getActions: (params: any) => [
        <div key={params.row.id} className="">
          {FormatDateShort(params?.row?.createdOn)}
        </div>,
      ],
    },
    { field: "serviceName", headerName: "Service Name", flex: 1 },
    {
      field: "amount",
      headerName: "Amount",
      type: "actions",
      flex: 1,
      getActions: (params: any) => [
        <div key={params.row.id} className="">
          Ghs {params?.row?.amount}
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
          onClick={() => {
            setSelectedInvoiceId(params.row.id);
            onOpen();
          }}
        >
          <VscEye size={20} />
        </button>,
      ],
    },
  ];

  return (
    <div>
      <DataTable
        isLoading={isLoading}
        rows={invoices ? invoices?.content : []}
        columns={columns}
      />
    </div>
  );
}

export default InvoiceList;
