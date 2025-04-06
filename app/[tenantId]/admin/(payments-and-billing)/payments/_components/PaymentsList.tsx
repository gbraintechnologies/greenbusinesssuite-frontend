"use client";

import DataTable from "@/components/DataTable/DataTable";
import StatusPill from "@/components/StatusPill/StatusPill";
import useCompany from "@/hooks/useCompany";
import { Button } from "@nextui-org/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import Link from "next/link";
import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { VscEye } from "react-icons/vsc";

function PaymentsList({
  setSelectedPayment,
  onOpen,
}: {
  setSelectedPayment: any;
  onOpen: any;
}) {
  const [rows, setRows] = useState([
    {
      id: 1,
      billId: "BID-345345",
      transactionId: "TASDF897234",
      paymentMethod: "Debit Card",
      customer: "Kwame Sintim",
      date: "27th March, 2025",
      service: "Business Registration",
      amount: 56,
      status: "active",
    },
    {
      id: 2,
      billId: "BID-345345",
      transactionId: "TASDF897234",
      paymentMethod: "Debit Card",
      customer: "Kwame Sintim",
      date: "27th March, 2025",
      service: "Business Registration",
      amount: 56,
      status: "active",
    },
    {
      id: 3,
      billId: "BID-345345",
      transactionId: "TASDF897234",
      paymentMethod: "Debit Card",
      customer: "Kwame Sintim",
      date: "27th March, 2025",
      service: "Business Registration",
      amount: 56,
      status: "active",
    },
    {
      id: 4,
      billId: "BID-345345",
      transactionId: "TASDF897234",
      paymentMethod: "Debit Card",
      customer: "Kwame Sintim",
      date: "27th March, 2025",
      service: "Business Registration",
      amount: 56,
      status: "active",
    },
  ]);

  const { companyBranding } = useCompany();

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
      <DataTable isLoading={false} rows={rows} columns={columns} />
    </div>
  );
}

export default PaymentsList;
