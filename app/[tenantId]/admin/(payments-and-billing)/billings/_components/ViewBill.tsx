import Border from "@/components/Border/Border";
import React from "react";

function ViewBill({
  bill,
}: {
  bill: {
    amount: number;
    date: string;
    id: string;
    service: string;
    status: string;
  } | null;
}) {
  console.log("selected bill", bill);

  const labelStyle = "text-sm text-gray-500 mb-1 block";
  const inputStyle =
    "border border-gray-300 rounded-lg p-2 w-full disabled:bg-gray-100 disabled:cursor-not-allowed";

  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-lg font-semibold">Viewing Bill {bill?.id}</h4>

      {/* Select Service */}
      <div>
        <label className={labelStyle}>Select Service</label>
        <p>{bill?.service}</p>
        <Border hasTopBottomMargin={false} />
      </div>
      <div>
        <label className={labelStyle}>Billing Type</label>
        <p>One-off bill</p>
        <Border hasTopBottomMargin={false} />
      </div>
      <div>
        <label className={labelStyle}>Currency</label>
        <p>GHS</p>
        <Border hasTopBottomMargin={false} />
      </div>
      <div>
        <label className={labelStyle}>Amount</label>
        <p>Ghc {bill?.amount}</p>
        <Border hasTopBottomMargin={false} />
      </div>

      <div>
        <label className={labelStyle}>Payment Methods</label>
        <p>Mobile Money</p>
        <Border hasTopBottomMargin={false} />
      </div>
      <div>
        <label className={labelStyle}>Status</label>
        <p>Active</p>
      </div>
    </div>
  );
}

export default ViewBill;
