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

function OneOffBills() {
  const [rows, setRows] = useState([
    {
      id: "BID-345345",
      date: "27th March, 2025",
      service: "Business Registration",
      amount: 56,
      status: "active",
    },
    {
      id: "BID-3451235",
      date: "24th March, 2025",
      service: "Tax Submission",
      amount: 240,
      status: "active",
    },
  ]);

  const { companyBranding } = useCompany();

  // columns
  const columns = [
    {
      field: "id",
      headerName: "Bill ID",
      align: "left",
      headerAlign: "left",
      flex: 1,
    },
    { field: "date", headerName: "Date Created", flex: 1 },
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
      field: "status",
      headerName: "Status",
      type: "actions",
      flex: 1,
      getActions: (params: any) => [
        <div key={params.row.id} className="">
          <StatusPill status="Active" />
        </div>,
      ],
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      type: "actions",
      getActions: (params: any) => [
        <Dropdown>
          <DropdownTrigger>
            <Button variant="light">
              {" "}
              <BsThreeDots size={20} />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            className="shadow-md bg-white border border-[#F1F5F9]  -mt-4 rounded-lg flex flex-col gap-3"
            aria-label="Static Actions"
          >
            <DropdownItem
              key="view"
              className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
            >
              <Link
                href={`/${companyBranding?.company_identifier}/admin/billings/bill?id=${params?.row?.id}&type=one-off-bill`}
                className="w-full block"
              >
                View
              </Link>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>,
      ],
    },
  ];

  return (
    <div>
      <DataTable isLoading={false} rows={rows} columns={columns} />
    </div>
  );
}

export default OneOffBills;
