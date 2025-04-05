"use client";

import React, { useState } from "react";

import Tabs from "@/components/Tabs/Tabs";

import CompanyThemedButton from "@/components/Buttons/CompanyThemedButton";
import ItemsPerPageSelector from "@/components/Pagination/ItemsPerPageSelector";
import DatePicker from "@/components/DatePicker/DatePicker";
import { TimelineType, TimelineValues } from "@/types";
import Pagination from "@/components/Pagination/Pagination";
import OneOffBills from "./_components/OneOffBills";
import RecurringBills from "./_components/RecurringBills";
import { useDisclosure } from "@nextui-org/modal";
import SideModal from "@/components/Modal/SideModal";
import CreateBill from "./_components/CreateBill";

function Billings() {
  //pagination
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
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

  return (
    <>
      <div className=" mt-10 pb-10 ">
        <div className="px-5 flex justify-between">
          <h3 className="font-semibold mb-8 text-xl">Billings</h3>

          <CompanyThemedButton onPress={onOpen}>
            Create New Bill
          </CompanyThemedButton>
        </div>

        <div className="px-5 flex justify-between mb-3">
          <DatePicker
            selectedTimeline={selectedTimeline}
            setSelectedTimeline={setSelectedTimeline}
          />
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
          {activeTab.id == 0 && <OneOffBills />}
          {activeTab.id == 1 && <RecurringBills />}
        </div>
      </div>

      {/* MODAL FOR CREATING BILL */}

      <SideModal onClose={onClose} onOpenChange={onOpenChange} isOpen={isOpen}>
        <CreateBill />
      </SideModal>
    </>
  );
}

export default Billings;
