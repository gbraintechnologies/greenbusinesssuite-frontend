"use client";

import React, { useState } from "react";

import Tabs from "@/components/Tabs/Tabs";

import CompanyThemedButton from "@/components/Buttons/CompanyThemedButton";
import ItemsPerPageSelector from "@/components/Pagination/ItemsPerPageSelector";
import DatePicker from "@/components/DatePicker/DatePicker";
import { TimelineType, TimelineValues } from "@/types";
import Pagination from "@/components/Pagination/Pagination";
import PaymentsList from "./_components/page";

function Payments() {
  //pagination
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  //timeline
  const [selectedTimeline, setSelectedTimeline] = useState<
    { label: TimelineValues; value: TimelineType } | undefined
  >();

  return (
    <div className="mt-10 pb-10 ">
      <div className=" px-5 flex justify-between">
        <h3 className="font-semibold mb-8 text-xl">Payments</h3>

        <CompanyThemedButton>Add Payment</CompanyThemedButton>
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
          <h2 className="text-3xl font-bold">Ghs 34,590</h2>
        </div>
        <div className="flex flex-col gap-8 px-4">
          <p className="text-gray-500 text-lg">Total Applications</p>
          <h2 className="text-3xl font-bold">2,498</h2>
        </div>
      </div>

      <div className="mt-5">
        <PaymentsList />
      </div>
    </div>
  );
}

export default Payments;
