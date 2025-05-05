"use client";

import DataTable from "@/components/DataTable/DataTable";

import useCompany from "@/hooks/useCompany";
import services from "@/services";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import React, { useState } from "react";

import { VscEye } from "react-icons/vsc";

function InvoiceList({
  setSelectedInvoice,
  onOpen,
}: {
  setSelectedInvoice: any;
  onOpen: any;
}) {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const queryClient = useQueryClient();

  const { data: invoices, isLoading } = useQuery({
    queryKey: ["all payments", page, limit],
    queryFn: services.getAllInvoices(page, limit),
  });

  console.log("invoices", invoices);

  // columns
  const columns = [
    {
      field: "invoiceId",
      headerName: "Invoice ID",
      align: "left",
      headerAlign: "left",
      flex: 1,
    },
    { field: "customer", headerName: "Customer", flex: 1 },
    { field: "date", headerName: "Date Paid", flex: 1 },
    { field: "service", headerName: "Service Name", flex: 1 },

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
          onClick={() => {
            setSelectedInvoice(params.row);
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
        rows={invoices?.content}
        columns={columns}
      />
    </div>
  );
}

export default InvoiceList;
