"use client";

import DataTable from "@/components/DataTable/DataTable";
import services from "@/services";
import { TimelineType } from "@/types";
import { FormatDateShort } from "@/utils/FormatDate/FormatDate";
import { useQuery } from "@tanstack/react-query";

import React, { useEffect, useState } from "react";

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

  const [searchInput, setSearchInput] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");

  useEffect(() => {
    const handle = setTimeout(() => setInvoiceNumber(searchInput.trim()), 400);
    return () => clearTimeout(handle);
  }, [searchInput]);

  const {
    data: invoiceByNumber,
    isLoading: isSearching,
    isError: searchFailed,
  } = useQuery({
    queryKey: ["invoice by number", invoiceNumber],
    queryFn: services.getInvoiceByNumber(invoiceNumber),
    enabled: invoiceNumber.length > 0,
    retry: false,
  });

  const rows = invoiceNumber
    ? invoiceByNumber && !searchFailed
      ? [invoiceByNumber]
      : []
    : invoices?.content ?? [];

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
      <div className="mb-3 px-5">
        <input
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Find by invoice number"
          className="h-9 w-64 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-600"
        />
      </div>
      <DataTable
        isLoading={isLoading || (Boolean(invoiceNumber) && isSearching)}
        rows={rows}
        columns={columns}
      />
    </div>
  );
}

export default InvoiceList;
