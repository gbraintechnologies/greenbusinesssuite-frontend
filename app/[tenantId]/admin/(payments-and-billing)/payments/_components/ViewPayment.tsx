import Border from "@/components/Border/Border";
import React from "react";

function ViewPayment({
  payment,
}: {
  payment: {
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
  console.log("selected payment", payment);

  const labelStyle = "text-sm text-gray-500 mb-1 block";
  const inputStyle =
    "border border-gray-300 rounded-lg p-2 w-full disabled:bg-gray-100 disabled:cursor-not-allowed";

  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-lg font-semibold">Viewing payment {payment?.id}</h4>

      {/* Select Service */}
      <div>
        <label className={labelStyle}>Transaction ID</label>
        <p>{payment?.transactionId}</p>
        <Border hasTopBottomMargin={false} />
      </div>
      <div>
        <label className={labelStyle}>Timestamp</label>
        <p>{payment?.date}</p>
        <Border hasTopBottomMargin={false} />
      </div>
      <div>
        <label className={labelStyle}>Service name</label>
        <p>{payment?.service}</p>
        <Border hasTopBottomMargin={false} />
      </div>
      <div>
        <label className={labelStyle}>Customer</label>
        <p>{payment?.customer}</p>
        <Border hasTopBottomMargin={false} />
      </div>

      <div>
        <label className={labelStyle}>Payment Method</label>
        <p>{payment?.paymentMethod}</p>
        <Border hasTopBottomMargin={false} />
      </div>

      <div>
        <label className={labelStyle}>Amount</label>
        <p>Ghc {payment?.amount}</p>
        <Border hasTopBottomMargin={false} />
      </div>

      <div>
        <label className={labelStyle}>Invoice</label>
        <p>INV-3478923</p>
      </div>
    </div>
  );
}

export default ViewPayment;
