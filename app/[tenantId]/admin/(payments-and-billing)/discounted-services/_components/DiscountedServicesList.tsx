"use client";

import DataTable from "@/components/DataTable/DataTable";
import Loader from "@/components/Loader/Loader";
import services from "@/services";
import { Button } from "@heroui/react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { toast } from "sonner";

function DiscountedServicesList({
  setSelectedService,
  onOpen,
}: {
  setSelectedService: any;
  onOpen: any;
}) {
  //pagination
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const queryClient = useQueryClient();

  const { data: discounts, isLoading } = useQuery({
    queryKey: ["discounts", page, limit],
    queryFn: services.getAllDiscounts(page, limit),
  });

  const deleteDiscount = (id: any) => {
    toast.info("Removing discount");
    services
      .deleteDiscount(id)
      .then((res) => {
        toast.dismiss();
        toast.success("Discount removed");
      })
      .catch((e) => {
        toast.dismiss();
        toast.error("Error deleting discount");
      });
  };

  console.log("discounts", discounts?.content);

  // columns
  const columns = [
    {
      field: "serviceName",
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
          Ghs {params?.row?.originalAmount}
        </div>,
      ],
    },

    {
      field: "discount",
      headerName: "Discount",
      type: "actions",
      flex: 1,
      getActions: (params: any) => [
        <div key={params.row.id} className="">
          {params.row.discountType.toLowerCase() == "amount" && (
            <>GHS {params?.row?.discountAmount}</>
          )}{" "}
          {params?.row?.discountType.toLowerCase() == "percentage" && (
            <>{params?.row?.discountPercentage}%</>
          )}{" "}
        </div>,
      ],
    },
    {
      field: "discountAmount",
      headerName: "Discounted Price",
      type: "actions",
      flex: 1,
      getActions: (params: any) => [
        <div key={params?.row?.id} className="">
          Ghs {params?.row?.discountedPrice}
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
                deleteDiscount(params.row.id);
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
      {isLoading && <Loader />}

      {discounts?.content?.length == 0 && !isLoading && (
        <div>No discounts available</div>
      )}
      {discounts?.content && (
        <DataTable
          isLoading={isLoading}
          rows={discounts?.content}
          columns={columns}
        />
      )}
    </div>
  );
}

export default DiscountedServicesList;
