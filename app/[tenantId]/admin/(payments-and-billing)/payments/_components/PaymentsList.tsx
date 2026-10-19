"use client";

import DataTable from "@/components/DataTable/DataTable";
import services from "@/services";
import { TimelineType } from "@/types";
import { FormatDateShort } from "@/utils/FormatDate/FormatDate";
import { useQuery } from "@tanstack/react-query";

import React, { useEffect, useState } from "react";

import { VscEye } from "react-icons/vsc";

type SearchField = "customer" | "service";

const PAYMENT_METHODS = ["MOBILE_MONEY", "CREDIT_DEBIT_CARD", "BANK_TRANSFER"];

function PaymentsList({
  setSelectedPaymentId,
  onOpen,
  timeline = "ALL",
}: {
  setSelectedPaymentId: (id: string | number) => void;
  onOpen: () => void;
  timeline?: TimelineType;
}) {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);

  const { data: payments, isLoading } = useQuery({
    queryKey: ["all payments", page, limit, timeline],
    queryFn: services.getAllPayments(page, limit, timeline),
  });

  const [searchField, setSearchField] = useState<SearchField>("customer");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [method, setMethod] = useState("");

  useEffect(() => {
    const handle = setTimeout(() => setSearch(searchInput.trim()), 400);
    return () => clearTimeout(handle);
  }, [searchInput]);

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ["payments search", searchField, search],
    queryFn:
      searchField === "customer"
        ? services.getPaymentsByCustomer(search)
        : services.getPaymentsByService(search),
    enabled: search.length > 0,
  });

  const { data: methodResults, isLoading: isLoadingMethod } = useQuery({
    queryKey: ["payments by method", method],
    queryFn: services.getPaymentsByMethod(method),
    enabled: method.length > 0,
  });

  const rows: any[] = (() => {
    const searchList = search
      ? Array.isArray(searchResults)
        ? searchResults
        : []
      : null;
    const methodList = method
      ? Array.isArray(methodResults)
        ? methodResults
        : []
      : null;
    if (searchList && methodList) {
      const ids = new Set(methodList.map((payment: any) => payment.id));
      return searchList.filter((payment: any) => ids.has(payment.id));
    }
    return searchList ?? methodList ?? payments?.content ?? [];
  })();

  const listLoading =
    isLoading ||
    (Boolean(search) && isSearching) ||
    (Boolean(method) && isLoadingMethod);

  const columns = [
    {
      field: "id",
      headerName: "Bill ID",
      align: "left",
      headerAlign: "left",
      flex: 1,
    },
    {
      field: "transactionId",
      headerName: "Transaction ID",
      align: "left",
      headerAlign: "left",
      flex: 1,
    },
    {
      field: "datePaid",
      headerName: "Date Paid",
      type: "actions",
      flex: 1,
      getActions: (params: any) => [
        <div key={params.row.id} className="">
          {FormatDateShort(params?.row?.datePaid)}
        </div>,
      ],
    },
    { field: "serviceName", headerName: "Service Name", flex: 1 },
    { field: "customerName", headerName: "Customer", flex: 1 },
    {
      field: "paymentMethod",
      headerName: "Payment Method",
      flex: 1,
      type: "actions",
      getActions: (params: any) => [
        <div key={params.row.id} className="">
          {params?.row?.paymentMethod.replaceAll("_", " ")}
        </div>,
      ],
    },
    {
      field: "amountPaid",
      headerName: "Amount",
      type: "actions",
      flex: 1,
      getActions: (params: any) => [
        <div key={params.row.id} className="">
          Ghs {params?.row?.amountPaid}
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
            setSelectedPaymentId(params.row.id);
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
      <div className="mb-3 flex flex-wrap items-center gap-2 px-5">
        <select
          value={searchField}
          onChange={(e) => setSearchField(e.target.value as SearchField)}
          className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-sm text-slate-700 outline-none focus:border-brand-600"
          aria-label="Search by"
        >
          <option value="customer">Customer</option>
          <option value="service">Service</option>
        </select>
        <input
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder={
            searchField === "customer"
              ? "Search by customer name"
              : "Search by service name"
          }
          className="h-9 w-60 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-600"
        />
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-sm text-slate-700 outline-none focus:border-brand-600"
          aria-label="Filter by payment method"
        >
          <option value="">All methods</option>
          {PAYMENT_METHODS.map((value) => (
            <option key={value} value={value}>
              {value
                .toLowerCase()
                .replaceAll("_", " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())}
            </option>
          ))}
        </select>
      </div>
      <DataTable isLoading={listLoading} rows={rows} columns={columns} />
    </div>
  );
}

export default PaymentsList;
