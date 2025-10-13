"use client";

import DatePicker from "@/components/DatePicker/DatePicker";
import ItemsPerPageSelector from "@/components/Pagination/ItemsPerPageSelector";
import Pagination from "@/components/Pagination/Pagination";
import { TimelineType, TimelineValues } from "@/types";
import React, { useState } from "react";
import DiscountedServicesList from "./_components/DiscountedServicesList";
import { useDisclosure } from "@heroui/modal";
import SideModal from "@/components/Modal/SideModal";
import EditDiscount from "./_components/EditDiscount";

function DiscountedServices() {
  //pagination
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);

  const [selectedService, setSelectedService] = useState<any>(null);
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const [selectedTimeline, setSelectedTimeline] = useState<
    { label: TimelineValues; value: TimelineType } | undefined
  >();

  return (
    <>
      <div>
        <div className="px-5 mt-10 pb-10 flex flex-col md:flex-row items-start gap-5 md:items-center justify-between">
          <h3 className="font-semibold text-xl">Discounted Services</h3>
          <div className="flex justify-between">
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
        </div>

        <DiscountedServicesList
          setSelectedService={setSelectedService}
          onOpen={onOpen}
        />
      </div>

      <SideModal onClose={onClose} onOpenChange={onOpenChange} isOpen={isOpen}>
        <EditDiscount onClose={onClose} discount={selectedService} />
      </SideModal>
    </>
  );
}

export default DiscountedServices;
