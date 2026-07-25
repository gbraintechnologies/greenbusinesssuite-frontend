"use client";

import React, { useState } from "react";

import ItemsPerPageSelector from "@/components/Pagination/ItemsPerPageSelector";
import DatePicker from "@/components/DatePicker/DatePicker";
import { TimelineType, TimelineValues } from "@/types";
import Pagination from "@/components/Pagination/Pagination";
import SideModal from "@/components/Modal/SideModal";
import { useDisclosure } from "@heroui/modal";
import ViewInvoice from "./_components/ViewInvoice";
import InvoiceList from "./_components/InvoiceList";

function Invoices() {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [selectedTimeline, setSelectedTimeline] = useState<
    { label: TimelineValues; value: TimelineType } | undefined
  >();

  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
    onOpenChange: onOpenChange2,
  } = useDisclosure();

  const [selectedInvoiceId, setSelectedInvoiceId] = useState<
    string | number | null
  >(null);

  const timeline = selectedTimeline?.value ?? "ALL";

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
        <InvoiceList
          timeline={timeline}
          setSelectedInvoiceId={setSelectedInvoiceId}
          onOpen={onOpen2}
        />
      </div>

      <SideModal
        onClose={onClose2}
        onOpenChange={onOpenChange2}
        isOpen={isOpen2}
      >
        <ViewInvoice invoiceId={selectedInvoiceId} />
      </SideModal>
    </div>
  );
}

export default Invoices;
