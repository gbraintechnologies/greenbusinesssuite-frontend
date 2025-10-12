"use client";

import React, { useState } from "react";

import CompanyThemedButton from "@/components/Buttons/CompanyThemedButton";
import ItemsPerPageSelector from "@/components/Pagination/ItemsPerPageSelector";
import DatePicker from "@/components/DatePicker/DatePicker";
import { TimelineType, TimelineValues } from "@/types";
import Pagination from "@/components/Pagination/Pagination";
import PaymentsList from "./_components/PaymentsList";
import SideModal from "@/components/Modal/SideModal";
import CreatePayment from "./_components/CreatePayment";
import { useDisclosure } from "@heroui/react/modal";
import ViewPayment from "./_components/ViewPayment";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";

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

  const [selectedPayment, setSelectedPayment] = useState(null);

  const { data: paymentsSummary, isLoading } = useQuery({
    queryKey: ["Payments Summary"],
    queryFn: services.getPaymentSummary(),
  });

  return (
    <div className="mt-10 pb-10 ">
      <div className=" px-5 flex justify-between">
        <h3 className="font-semibold mb-8 text-xl">Payments</h3>

        <CompanyThemedButton onPress={onOpen}>Add Payment</CompanyThemedButton>
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

      {/* SUMMARY */}

      <div className="mx-5  mt-5 border border-gray-200 rounded-xl p-4 grid grid-cols-2 divide-x-2 divide-gray-200 gap-10">
        <div className="flex flex-col gap-8 px-4">
          <p className="text-gray-500 text-lg">Total Revenue</p>
          <h2 className="text-3xl font-bold">Ghs {paymentsSummary}</h2>
        </div>
        {/* <div className="flex flex-col gap-8 px-4">
          <p className="text-gray-500 text-lg">Total Applications</p>
          <h2 className="text-3xl font-bold">2,498</h2>
        </div> */}
      </div>

      <div className="mt-5">
        <PaymentsList
          setSelectedPayment={setSelectedPayment}
          onOpen={onOpen2}
        />
      </div>

      <SideModal onClose={onClose} onOpenChange={onOpenChange} isOpen={isOpen}>
        <CreatePayment />
      </SideModal>

      <SideModal
        onClose={onClose2}
        onOpenChange={onOpenChange2}
        isOpen={isOpen2}
      >
        <ViewPayment payment={selectedPayment} />
      </SideModal>
    </div>
  );
}

export default Payments;
