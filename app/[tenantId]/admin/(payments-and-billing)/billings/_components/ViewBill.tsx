import Border from "@/components/Border/Border";
import React from "react";

function ViewBill({
  bill,
}: {
  bill: {
    amount: number;
    createdOn: Date;
    updatedOn: Date;
    currency: string;
    id: string;
    serviceName: string;
    paymentMethods: string[];
    billingType: string;
    formId: number;
    status: string;
  } | null;
}) {
  const labelStyle = "text-sm text-gray-500 mb-1 block";
  const inputStyle =
    "border border-gray-300 rounded-lg p-2 w-full disabled:bg-gray-100 disabled:cursor-not-allowed";

  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-lg font-semibold">Viewing Bill #{bill?.id}</h4>

      {/* Select Service */}
      <div>
        <label className={labelStyle}>Select Service</label>
        <p>{bill?.serviceName}</p>
        <Border hasTopBottomMargin={false} />
      </div>
      <div>
        <label className={labelStyle}>Billing Type</label>
        <p>{bill?.billingType.replaceAll("_", " ")}</p>
        <Border hasTopBottomMargin={false} />
      </div>
      <div>
        <label className={labelStyle}>Currency</label>
        <p>{bill?.currency}</p>
        <Border hasTopBottomMargin={false} />
      </div>
      <div>
        <label className={labelStyle}>Amount</label>
        <p>
          {bill?.currency} {bill?.amount}
        </p>
        <Border hasTopBottomMargin={false} />
      </div>

      <div>
        <label className={labelStyle}>Payment Methods</label>
        <p>{bill?.paymentMethods.toString().replaceAll("_", " ")}</p>
        <Border hasTopBottomMargin={false} />
      </div>
      <div>
        <label className={labelStyle}>Status</label>
        <p>{bill?.status}</p>
      </div>
    </div>
  );
}

export default ViewBill;
