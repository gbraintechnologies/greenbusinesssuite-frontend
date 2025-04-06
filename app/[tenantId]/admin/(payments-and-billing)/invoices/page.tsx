"use client";

import React, { useState } from "react";

import ItemsPerPageSelector from "@/components/Pagination/ItemsPerPageSelector";
import DatePicker from "@/components/DatePicker/DatePicker";
import { TimelineType, TimelineValues } from "@/types";

import SideModal from "@/components/Modal/SideModal";
import CreatePayment from "./_components/CreatePayment";
import { useDisclosure } from "@nextui-org/modal";
import ViewPayment from "./_components/ViewInvoice";
import InvoiceList from "./_components/InvoiceList";
import Pagination from "@/components/Pagination/Pagination";
import ViewInvoice from "./_components/ViewInvoice";

function Payments() {
  //pagination
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  //timeline
  const [selectedTimeline, setSelectedTimeline] = useState<
    { label: TimelineValues; value: TimelineType } | undefined
  >();

  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
    onOpenChange: onOpenChange2,
  } = useDisclosure();

  const [selectedInvoice, setSelectedInvoice] = useState(null);

  return (
    <div className="mt-10 pb-10 ">
      <div className=" px-5 flex justify-between">
        <h3 className="font-semibold mb-8 text-xl">Invoices</h3>
      </div>

      <div className=" px-5 flex justify-between mb-3">
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

      <div className="mt-5">
        <InvoiceList setSelectedInvoice={setSelectedInvoice} onOpen={onOpen2} />
      </div>

      <SideModal onClose={onClose} onOpenChange={onOpenChange} isOpen={isOpen}>
        <CreatePayment />
      </SideModal>

      <SideModal
        onClose={onClose2}
        onOpenChange={onOpenChange2}
        isOpen={isOpen2}
      >
        <ViewInvoice invoice={selectedInvoice} />
      </SideModal>
    </div>
  );
}

export default Payments;
