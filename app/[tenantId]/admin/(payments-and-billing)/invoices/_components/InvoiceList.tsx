"use client";

import DataTable from "@/components/DataTable/DataTable";

import useCompany from "@/hooks/useCompany";

import React, { useState } from "react";

import { VscEye } from "react-icons/vsc";

function InvoiceList({
  setSelectedInvoice,
  onOpen,
}: {
  setSelectedInvoice: any;
  onOpen: any;
}) {
  const [rows, setRows] = useState([
    {
      id: 1,
      invoiceId: "BID-345345",
      customer: "Kwame Sintim",
      date: "27th March, 2025",
      service: "Business Registration",
      amount: 56,
    },
  ]);

  const { companyBranding } = useCompany();

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
      <DataTable isLoading={false} rows={rows} columns={columns} />
    </div>
  );
}

export default InvoiceList;
