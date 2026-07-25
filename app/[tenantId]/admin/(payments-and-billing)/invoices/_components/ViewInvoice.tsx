"use client";

import Border from "@/components/Border/Border";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import services from "@/services";
import { Invoice } from "@/types";
import { FormatDateShort } from "@/utils/FormatDate/FormatDate";
import { useQuery } from "@tanstack/react-query";
import React from "react";

function ViewInvoice({
  invoice,
  invoiceId,
}: {
  invoice?: Invoice | null;
  invoiceId?: string | number | null;
}) {
  const id = invoiceId ?? invoice?.id;
  const hasListData = Boolean(invoice && !invoiceId);

  const { data: fetchedInvoice, isLoading } = useQuery({
    queryKey: ["invoice", id],
    queryFn: services.getInvoiceById(id!),
    enabled: Boolean(id) && !hasListData,
  });

  const details = hasListData ? invoice : fetchedInvoice;

  if (!id && !invoice) {
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
    return <p className="text-sm text-gray-500">Invoice not found.</p>;
  }

  const labelStyle = "text-sm text-gray-500 mb-1 block";

  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-lg font-semibold">Viewing Invoice {details.id}</h4>

      <div>
        <label className={labelStyle}>Invoice Number</label>
        <p>{details.invoiceNumber}</p>
        <Border hasTopBottomMargin={false} />
      </div>
      <div>
        <label className={labelStyle}>Created On</label>
        <p>{FormatDateShort(details.createdOn)}</p>
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
        <label className={labelStyle}>Amount</label>
        <p>Ghc {details.amount}</p>
        <Border hasTopBottomMargin={false} />
      </div>
    </div>
  );
}

export default ViewInvoice;
