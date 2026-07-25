"use client";

import Border from "@/components/Border/Border";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import services from "@/services";
import { Payment } from "@/types";
import { FormatDateShort } from "@/utils/FormatDate/FormatDate";
import { useQuery } from "@tanstack/react-query";
import React from "react";

function ViewPayment({
  payment,
  paymentId,
}: {
  payment?: Payment | null;
  paymentId?: string | number | null;
}) {
  const id = paymentId ?? payment?.id;
  const hasListData = Boolean(payment && !paymentId);

  const { data: fetchedPayment, isLoading } = useQuery({
    queryKey: ["payment", id],
    queryFn: services.getPaymentById(id!),
    enabled: Boolean(id) && !hasListData,
  });

  const details = hasListData ? payment : fetchedPayment;

  if (!id && !payment) {
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
    return <p className="text-sm text-gray-500">Payment not found.</p>;
  }

  const labelStyle = "text-sm text-gray-500 mb-1 block";

  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-lg font-semibold">Viewing payment {details.id}</h4>

      <div>
        <label className={labelStyle}>Transaction ID</label>
        <p>{details.transactionId}</p>
        <Border hasTopBottomMargin={false} />
      </div>
      <div>
        <label className={labelStyle}>Timestamp</label>
        <p>{FormatDateShort(details.datePaid)}</p>
        <Border hasTopBottomMargin={false} />
      </div>
      <div>
        <label className={labelStyle}>Status</label>
        <p>{details.status}</p>
        <Border hasTopBottomMargin={false} />
      </div>
      <div>
        <label className={labelStyle}>Service name</label>
        <p>{details.serviceName}</p>
        <Border hasTopBottomMargin={false} />
      </div>
      <div>
        <label className={labelStyle}>Customer</label>
        <p>{details.customerName}</p>
        <Border hasTopBottomMargin={false} />
      </div>
      <div>
        <label className={labelStyle}>Payment Method</label>
        <p>{details.paymentMethod?.replaceAll("_", " ")}</p>
        <Border hasTopBottomMargin={false} />
      </div>
      <div>
        <label className={labelStyle}>Amount</label>
        <p>Ghc {details.amountPaid}</p>
      </div>
    </div>
  );
}

export default ViewPayment;
