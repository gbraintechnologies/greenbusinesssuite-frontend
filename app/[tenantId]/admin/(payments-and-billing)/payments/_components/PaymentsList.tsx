"use client";

import DataTable from "@/components/DataTable/DataTable";
import services from "@/services";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import React, { useState } from "react";

import { VscEye } from "react-icons/vsc";

function PaymentsList({
  setSelectedPayment,
  onOpen,
}: {
  setSelectedPayment: any;
  onOpen: any;
}) {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const queryClient = useQueryClient();

  const { data: payments, isLoading } = useQuery({
    queryKey: ["all payments", page, limit],
    queryFn: services.getAllPayments(page, limit),
  });

  console.log("paymnets", payments);

  // columns
  const columns = [
    {
      field: "billId",
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
    { field: "date", headerName: "Date Paid", flex: 1 },
    { field: "service", headerName: "Service Name", flex: 1 },
    { field: "customer", headerName: "Customer", flex: 1 },
    { field: "paymentMethod", headerName: "Payment Method", flex: 1 },
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
            setSelectedPayment(params.row);
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
        rows={payments?.content}
        columns={columns}
      />
    </div>
  );
}

export default PaymentsList;
