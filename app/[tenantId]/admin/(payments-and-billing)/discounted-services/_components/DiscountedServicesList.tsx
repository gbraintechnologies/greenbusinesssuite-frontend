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
import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";

function DiscountedServicesList({
  setSelectedService,
  onOpen,
}: {
  setSelectedService: any;
  onOpen: any;
}) {
  const [rows, setRows] = useState([
    {
      id: "Business Registration",
      date: "27th March, 2025",
      service: "Business Registration",
      discount: "45%",
      amount: 56,
      discountAmount: 20,
      status: "active",
    },
  ]);

  const { companyBranding } = useCompany();

  // columns
  const columns = [
    {
      field: "id",
      headerName: "Service Name",
      align: "left",
      headerAlign: "left",
      flex: 1,
    },
    {
      field: "amount",
      headerName: "Original Amount",
      type: "actions",
      flex: 1,
      getActions: (params: any) => [
        <div key={params.row.id} className="">
          Ghs {params?.row?.amount}
        </div>,
      ],
    },

    { field: "discount", headerName: "Discount", flex: 1 },
    {
      field: "discountAmount",
      headerName: "Discounted Price",
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
            {/* VIEW */}
            <DropdownItem
              onPress={() => {
                setSelectedService(params.row);
                onOpen();
              }}
              key="view"
              className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
            >
              Edit
            </DropdownItem>

            {/* DELETE */}
            <DropdownItem
              onPress={() => {
                //
              }}
              key="delete"
              className="items-center w-full p-3 rounded-md text-sm text-red-600 hover:bg-[#F1F5F9]"
            >
              Remove Discount
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

export default DiscountedServicesList;
