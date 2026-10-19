"use client";

import DataTable from "@/components/DataTable/DataTable";
import Loader from "@/components/Loader/Loader";
import StatusPill from "@/components/StatusPill/StatusPill";
import services from "@/services";
import { Button } from "@heroui/react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { toast } from "sonner";

type StatusFilter = "all" | "active" | "inactive";

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

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
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const queryClient = useQueryClient();

  const { data: discounts, isLoading } = useQuery({
    queryKey: ["discounts", page, limit],
    queryFn: services.getAllDiscounts(page, limit),
  });

  const { data: activeDiscounts } = useQuery({
    queryKey: ["discounts-by-status", true],
    queryFn: services.getDiscountsByStatus(true),
  });

  const activeIds = useMemo(
    () =>
      new Set(
        (Array.isArray(activeDiscounts) ? activeDiscounts : []).map(
          (discount: any) => String(discount?.id)
        )
      ),
    [activeDiscounts]
  );

  const isRowActive = (row: any) =>
    activeIds.has(String(row?.discountId ?? row?.id));

  const rows = useMemo(() => {
    const content = discounts?.content ?? [];
    if (statusFilter === "all") return content;
    return content.filter((row: any) =>
      statusFilter === "active" ? isRowActive(row) : !isRowActive(row)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discounts, statusFilter, activeIds]);

  const refreshDiscounts = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["discounts"] }),
      queryClient.invalidateQueries({ queryKey: ["discounts-by-status"] }),
    ]);

  const deleteDiscount = (id: any) => {
    toast.info("Removing discount");
    services
      .deleteDiscount(id)
      .then(async () => {
        toast.dismiss();
        toast.success("Discount removed");
        await refreshDiscounts();
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Error deleting discount");
      });
  };

  const deactivateDiscount = (row: any) => {
    const discountId = row?.discountId ?? row?.id;
    toast.info("Deactivating discount");
    services
      .deactivateDiscount(discountId)
      .then(async () => {
        toast.dismiss();
        toast.success("Discount deactivated");
        await refreshDiscounts();
      })
      .catch((e: any) => {
        toast.dismiss();
        toast.error(
          e?.response?.data?.message ?? "Error deactivating discount"
        );
      });
  };

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
          {params.row.discountType?.toLowerCase() == "amount" && (
            <>GHS {params?.row?.discountAmount}</>
          )}{" "}
          {params?.row?.discountType?.toLowerCase() == "percentage" && (
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
      field: "status",
      headerName: "Status",
      type: "actions",
      flex: 1,
      getActions: (params: any) => [
        <StatusPill
          key={params?.row?.id}
          status={isRowActive(params.row) ? "active" : "inactive"}
        />,
      ],
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      type: "actions",
      getActions: (params: any) => [
        <Dropdown key={params?.row?.id}>
          <DropdownTrigger>
            <Button variant="light">
              {" "}
              <BsThreeDots size={20} />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            className="shadow-md bg-white border border-[#F1F5F9]  -mt-4 rounded-lg flex flex-col gap-3"
            aria-label="Static Actions"
            disabledKeys={isRowActive(params.row) ? [] : ["deactivate"]}
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

            {/* DEACTIVATE */}
            <DropdownItem
              onPress={() => deactivateDiscount(params.row)}
              key="deactivate"
              className="items-center w-full p-3 rounded-md text-sm text-[#D97706] hover:bg-[#F1F5F9]"
            >
              Deactivate
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
      <div className="mb-4 flex gap-2">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setStatusFilter(filter.value)}
            className={`rounded-lg border px-3 py-1.5 text-sm ${
              statusFilter === filter.value
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {isLoading && <Loader />}

      {rows.length == 0 && !isLoading && <div>No discounts available</div>}
      {rows.length > 0 && (
        <DataTable isLoading={isLoading} rows={rows} columns={columns} />
      )}
    </div>
  );
}

export default DiscountedServicesList;
