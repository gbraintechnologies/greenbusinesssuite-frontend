"use client";

import Border from "@/components/Border/Border";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import services from "@/services";
import { Bill } from "@/types";
import { useQuery } from "@tanstack/react-query";
import React from "react";

function ViewBill({
  bill,
  billId,
}: {
  bill?: Bill | null;
  billId?: string | number | null;
}) {
  const id = billId ?? bill?.id;
  const hasListData = Boolean(bill && !billId);

  const { data: fetchedBill, isLoading } = useQuery({
    queryKey: ["bill", id],
    queryFn: services.getBillById(id!),
    enabled: Boolean(id) && !hasListData,
  });

  const details = hasListData ? bill : fetchedBill;

  if (!id && !bill) {
    return null;
  }

  if (isLoading && !hasListData) {
    return (
      <div className="flex justify-center py-10">
        <LoadingIcon />
      </div>
    );
  }

  if (!details) {
    return <p className="text-sm text-gray-500">Bill not found.</p>;
  }

  const labelStyle = "text-sm text-gray-500 mb-1 block";

  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-lg font-semibold">Viewing Bill #{details.id}</h4>

      <div>
        <label className={labelStyle}>Select Service</label>
        <p>{details.serviceName}</p>
        <Border hasTopBottomMargin={false} />
      </div>
      <div>
        <label className={labelStyle}>Billing Type</label>
        <p>{details.billingType?.replaceAll("_", " ")}</p>
        <Border hasTopBottomMargin={false} />
      </div>
      <div>
        <label className={labelStyle}>Currency</label>
        <p>{details.currency}</p>
        <Border hasTopBottomMargin={false} />
      </div>
      <div>
        <label className={labelStyle}>Amount</label>
        <p>
          {details.currency} {details.amount}
        </p>
        <Border hasTopBottomMargin={false} />
      </div>
      <div>
        <label className={labelStyle}>Payment Methods</label>
        <p>{details.paymentMethods?.toString().replaceAll("_", " ")}</p>
        <Border hasTopBottomMargin={false} />
      </div>
      <div>
        <label className={labelStyle}>Status</label>
        <p>{details.status}</p>
      </div>
    </div>
  );
}

export default ViewBill;
