import Border from "@/components/Border/Border";
import { FormatDateShort } from "@/utils/FormatDate/FormatDate";
import React from "react";

function ViewInvoice({
  invoice,
}: {
  invoice: {
    id: string;
    invoiceNumber: string;
    transactionId: string;
    customerName: string;
    createdOn: Date;
    serviceName: string;
    amount: number;
  } | null;
}) {
  const labelStyle = "text-sm text-gray-500 mb-1 block";
  const inputStyle =
    "border border-gray-300 rounded-lg p-2 w-full disabled:bg-gray-100 disabled:cursor-not-allowed";

  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-lg font-semibold">Viewing Invoice {invoice?.id}</h4>

      {/* Select Service */}
      <div>
        <label className={labelStyle}>Invoice Number</label>
        <p>{invoice?.invoiceNumber}</p>
        <Border hasTopBottomMargin={false} />
      </div>
      <div>
        <label className={labelStyle}>Created On</label>
        <p>{FormatDateShort(invoice?.createdOn)}</p>
        <Border hasTopBottomMargin={false} />
      </div>
      <div>
        <label className={labelStyle}>Service name</label>
        <p>{invoice?.serviceName}</p>
        <Border hasTopBottomMargin={false} />
      </div>
      <div>
        <label className={labelStyle}>Customer</label>
        <p>{invoice?.customerName}</p>
        <Border hasTopBottomMargin={false} />
      </div>

      <div>
        <label className={labelStyle}>Amount</label>
        <p>Ghc {invoice?.amount}</p>
        <Border hasTopBottomMargin={false} />
      </div>
    </div>
  );
}

export default ViewInvoice;
