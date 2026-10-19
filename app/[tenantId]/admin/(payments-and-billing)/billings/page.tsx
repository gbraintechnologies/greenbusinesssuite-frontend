"use client";

import React, { useEffect, useState } from "react";

import Tabs from "@/components/Tabs/Tabs";

import CompanyThemedButton from "@/components/Buttons/CompanyThemedButton";
import ItemsPerPageSelector from "@/components/Pagination/ItemsPerPageSelector";
import DatePicker from "@/components/DatePicker/DatePicker";
import { TimelineType, TimelineValues } from "@/types";
import Pagination from "@/components/Pagination/Pagination";
import OneOffBills from "./_components/OneOffBills";
import RecurringBills from "./_components/RecurringBills";
import { useDisclosure } from "@heroui/modal";
import SideModal from "@/components/Modal/SideModal";
import CreateBill from "./_components/CreateBill";
import ViewBill from "./_components/ViewBill";
import AddDiscount from "./_components/AddDiscount";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import services from "@/services";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import { toast } from "sonner";
import EditBill from "./_components/EditBill";

const BILL_STATUSES = ["ACTIVE", "INACTIVE", "PENDING", "PAID", "CANCELLED"];

function Billings() {
  //pagination
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const queryClient = useQueryClient();

  // Bill Functions
  const [selectedBill, setSelectedBill] = useState<any>(null);
  const deleteBill = (id: any) => {
    toast.info("Deleting bill...");
    services
      .deleteBill(id)
      .then((res) => {
        toast.dismiss();
        toast.success("Successfully deleted bill");
        queryClient.invalidateQueries();
      })
      .catch((e) => {
        toast.error("Error deleting bill");
        toast.dismiss();
      });
  };

  const updateBill = (data: any) => {
    toast.info("Updating bill...");
    services
      .updateBill(data)
      .then((res) => {
        toast.dismiss();
        toast.success("Successfully updated bill");
        queryClient.invalidateQueries();
      })
      .catch((e) => {
        toast.error("Error updating bill");
        toast.dismiss();
      });
  };

  const { data: bills, isLoading } = useQuery({
    queryKey: ["all bills ", page, limit],
    queryFn: services.getAllBills(page, limit),
  });

  // Server-side filters: service-name search and status
  const [searchInput, setSearchInput] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const handle = setTimeout(() => setServiceSearch(searchInput.trim()), 400);
    return () => clearTimeout(handle);
  }, [searchInput]);

  const { data: billsBySearch, isLoading: isSearching } = useQuery({
    queryKey: ["bills by service", serviceSearch],
    queryFn: services.getBillsByServiceName(serviceSearch),
    enabled: serviceSearch.length > 0,
  });

  const { data: billsByStatus, isLoading: isLoadingStatus } = useQuery({
    queryKey: ["bills by status", statusFilter],
    queryFn: services.getBillsByStatus(statusFilter),
    enabled: statusFilter.length > 0,
  });

  const filteredBills: any[] | undefined = (() => {
    const searchList = serviceSearch
      ? Array.isArray(billsBySearch)
        ? billsBySearch
        : []
      : null;
    const statusList = statusFilter
      ? Array.isArray(billsByStatus)
        ? billsByStatus
        : []
      : null;
    if (searchList && statusList) {
      const ids = new Set(statusList.map((bill: any) => bill.id));
      return searchList.filter((bill: any) => ids.has(bill.id));
    }
    return searchList ?? statusList ?? bills?.content;
  })();

  const filtersActive = Boolean(serviceSearch || statusFilter);
  const listLoading =
    isLoading ||
    (Boolean(serviceSearch) && isSearching) ||
    (Boolean(statusFilter) && isLoadingStatus);

  //timeline
  const [selectedTimeline, setSelectedTimeline] = useState<
    { label: TimelineValues; value: TimelineType } | undefined
  >();

  //
  const [tabs, setTabs] = useState([
    { id: 0, name: "One-off Bill", value: "one-off-bill" },
    { id: 1, name: "Recurring Bill", value: "recurring-bill" },
  ]);
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
    onOpenChange: onOpenChange2,
  } = useDisclosure();

  const {
    isOpen: isOpen3,
    onOpen: onOpen3,
    onClose: onClose3,
    onOpenChange: onOpenChange3,
  } = useDisclosure();

  const {
    isOpen: isOpen4,
    onOpen: onOpen4,
    onClose: onClose4,
    onOpenChange: onOpenChange4,
  } = useDisclosure();

  const { data: billsOneOff, isLoading: isLoadingOneOff } = useQuery({
    queryKey: ["ONE OFF BILLS "],
    queryFn: services.getAllOneOffBill(),
  });

  const { data: billsRecurring, isLoading: isLoadingRecurringBills } = useQuery(
    {
      queryKey: ["ONE OFF BILLS "],
      queryFn: services.getAllRecurringBills(),
    }
  );

  return (
    <>
      <div className=" mt-10 pb-10 ">
        <div className="px-5 flex justify-between">
          <h3 className="font-semibold mb-8 text-xl">Billings</h3>

          <CompanyThemedButton onPress={onOpen}>
            Create New Bill
          </CompanyThemedButton>
        </div>

        <div className="px-5 flex flex-wrap justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <DatePicker
              selectedTimeline={selectedTimeline}
              setSelectedTimeline={setSelectedTimeline}
            />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by service name"
              className="h-9 w-56 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-600"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-sm text-slate-700 outline-none focus:border-brand-600"
              aria-label="Filter by status"
            >
              <option value="">All statuses</option>
              {BILL_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
          {!filtersActive && (
            <div className="flex items-center gap-2">
              <ItemsPerPageSelector limit={limit} setLimit={setLimit} />

              <Pagination
                limit={limit}
                variant="no-text"
                page={page}
                currentData={[]}
                setPage={setPage}
              />
            </div>
          )}
        </div>

        <div className="px-5 flex items-center w-full justify-center">
          <Tabs
            filters={tabs}
            setActiveFilter={setActiveTab}
            activeFilter={activeTab}
            tabQueryKey="tabId"
          />
        </div>

        <div className="mt-5">
          {activeTab.id == 0 && (
            <OneOffBills
              // bills={billsOneOff}
              // isLoading={isLoadingOneOff}
              deleteBill={deleteBill}
              updateBill={updateBill}
              bills={filteredBills?.filter(
                (item: any) => item.billingType == "ONE_OFF_BILL"
              )}
              isLoading={listLoading}
              setSelectedBill={setSelectedBill}
              onOpen={onOpen2}
              onOpenEdit={onOpen4}
              onOpenDiscountModal={onOpen3}
            />
          )}
          {activeTab.id == 1 && (
            <RecurringBills
              deleteBill={deleteBill}
              updateBill={updateBill}
              bills={filteredBills?.filter(
                (item: any) => item.billingType !== "ONE_OFF_BILL"
              )}
              onOpenEdit={onOpen4}
              isLoading={listLoading}
              setSelectedBill={setSelectedBill}
              onOpenDiscountModal={onOpen3}
              onOpen={onOpen2}
            />
          )}
        </div>
      </div>

      {/* MODAL FOR CREATING BILL */}

      <SideModal onClose={onClose} onOpenChange={onOpenChange} isOpen={isOpen}>
        <CreateBill onClose={onClose} />
      </SideModal>

      {/* VIEW BILL */}
      <SideModal
        onClose={onClose2}
        onOpenChange={onOpenChange2}
        isOpen={isOpen2}
      >
        <ViewBill billId={selectedBill?.id} />
      </SideModal>

      {/* ADD DISCOUNT */}
      <SideModal
        onClose={onClose3}
        onOpenChange={onOpenChange3}
        isOpen={isOpen3}
      >
        <AddDiscount onClose={onClose3} bill={selectedBill} />
      </SideModal>

      <SideModal
        onClose={onClose4}
        onOpenChange={onOpenChange4}
        isOpen={isOpen4}
      >
        <EditBill onClose={onClose4} bill={selectedBill} />
      </SideModal>
    </>
  );
}

export default Billings;
