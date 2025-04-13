"use client";

import DataTable from "@/components/DataTable/DataTable";
import StatusPill from "@/components/StatusPill/StatusPill";
import useCompany from "@/hooks/useCompany";

import { FormatDateShort } from "@/utils/FormatDate/FormatDate";
import { Button } from "@nextui-org/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";

import React from "react";
import { BsThreeDots } from "react-icons/bs";

function RecurringBills({
  setSelectedBill,
  onOpen,
  onOpenDiscountModal,
  bills,
  isLoading,
  deleteBill,
  updateBill,
  onOpenEdit,
}: {
  setSelectedBill: any;
  onOpen: any;
  onOpenDiscountModal: any;
  bills: any;
  isLoading: boolean;
  deleteBill: any;
  updateBill: any;
  onOpenEdit: any;
}) {
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
    {
      field: "createdOn",
      headerName: "Date Created",
      flex: 1,
      type: "actions",
      getActions: (params: any) => [
        <p>{FormatDateShort(params?.row?.createdOn)}</p>,
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
          {params?.row.currency} {params?.row?.amount}
        </div>,
      ],
    },
    {
      field: "status",
      headerName: "Status",
      type: "actions",
      flex: 1,
      getActions: (params: any) => [
        <div key={params.row.id}>
          <StatusPill status={params?.row?.status} />
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
                setSelectedBill(params.row);
                onOpen();
              }}
              key="view"
              className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
            >
              View
            </DropdownItem>

            {/* EDIT */}
            <DropdownItem
              onPress={() => {
                setSelectedBill(params.row);
                onOpenEdit();
              }}
              key="edit"
              className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
            >
              Edit
            </DropdownItem>
            {/* ADD DISCOUNT */}
            <DropdownItem
              onPress={() => {
                setSelectedBill(params.row);
                onOpenDiscountModal();
              }}
              key="add-discount"
              className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
            >
              Add Discount
            </DropdownItem>

            {/* DEACTIVATE */}
            {params.row.status.toLowerCase() == "active" ? (
              <DropdownItem
                onPress={() => {
                  updateBill({ ...params.row, status: "INACTIVE" });
                }}
                key="deactivate"
                className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
              >
                Deactivate
              </DropdownItem>
            ) : (
              <DropdownItem
                onPress={() => {
                  updateBill({ ...params.row, status: "ACTIVE" });
                }}
                key="activate"
                className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
              >
                Activate
              </DropdownItem>
            )}

            {/* DELETE */}
            <DropdownItem
              onPress={() => {
                deleteBill(params.row.id);
              }}
              key="delete"
              className="items-center w-full p-3 rounded-md text-sm text-red-600 hover:bg-[#F1F5F9]"
            >
              Delete
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>,
      ],
    },
  ];

  return (
    <div>
      <DataTable
        isLoading={isLoading}
        rows={bills ? bills : []}
        columns={columns}
      />
    </div>
  );
}

export default RecurringBills;
