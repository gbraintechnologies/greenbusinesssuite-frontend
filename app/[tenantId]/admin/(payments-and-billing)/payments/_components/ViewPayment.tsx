import Border from "@/components/Border/Border";
import { FormatDateShort } from "@/utils/FormatDate/FormatDate";
import React from "react";

function ViewPayment({
  payment,
}: {
  payment: {
    id: string;
    billId: string;
    transactionId: string;
    paymentMethod: string;
    customerName: string;
    datePaid: string;
    serviceName: string;
    amountPaid: number;
    status: string;
  } | null;
}) {
  const labelStyle = "text-sm text-gray-500 mb-1 block";
  const inputStyle =
    "border border-gray-300 rounded-lg p-2 w-full disabled:bg-gray-100 disabled:cursor-not-allowed";

  if (payment) {
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
          <p>{FormatDateShort(payment?.datePaid)}</p>
          <Border hasTopBottomMargin={false} />
        </div>
        <div>
          <label className={labelStyle}>Status</label>
          <p>{payment?.status}</p>
          <Border hasTopBottomMargin={false} />
        </div>
        <div>
          <label className={labelStyle}>Service name</label>
          <p>{payment?.serviceName}</p>
          <Border hasTopBottomMargin={false} />
        </div>
        <div>
          <label className={labelStyle}>Customer</label>
          <p>{payment?.customerName}</p>
          <Border hasTopBottomMargin={false} />
        </div>

        <div>
          <label className={labelStyle}>Payment Method</label>
          <p>{payment?.paymentMethod.replaceAll("_", " ")}</p>
          <Border hasTopBottomMargin={false} />
        </div>

        <div>
          <label className={labelStyle}>Amount</label>
          <p>Ghc {payment?.amountPaid}</p>
        </div>
      </div>
    );
  }
}

export default ViewPayment;
