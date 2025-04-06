import Border from "@/components/Border/Border";
import React from "react";

function ViewInvoice({
  invoice,
}: {
  invoice: {
    id: string;
    billId: string;
    transactionId: string;
    paymentMethod: string;
    customer: string;
    date: string;
    service: string;
    amount: number;
    status: string;
  } | null;
}) {
  const labelStyle = "text-sm text-gray-500 mb-1 block";
  const inputStyle =
    "border border-gray-300 rounded-lg p-2 w-full disabled:bg-gray-100 disabled:cursor-not-allowed";

  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-lg font-semibold">Viewing invoice {invoice?.id}</h4>

      {/* Select Service */}
      <div>
        <label className={labelStyle}>Transaction ID</label>
        <p>{invoice?.transactionId}</p>
        <Border hasTopBottomMargin={false} />
      </div>
      <div>
        <label className={labelStyle}>Timestamp</label>
        <p>{invoice?.date}</p>
        <Border hasTopBottomMargin={false} />
      </div>
      <div>
        <label className={labelStyle}>Service name</label>
        <p>{invoice?.service}</p>
        <Border hasTopBottomMargin={false} />
      </div>
      <div>
        <label className={labelStyle}>Customer</label>
        <p>{invoice?.customer}</p>
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
