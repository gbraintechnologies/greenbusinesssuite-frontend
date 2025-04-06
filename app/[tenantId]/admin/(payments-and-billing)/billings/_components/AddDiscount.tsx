"use client";

import CompanyThemedButton from "@/components/Buttons/CompanyThemedButton";
import React from "react";

function AddDiscount({
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
  console.log("selected bill to add discount", bill);
  const labelStyle = "text-sm text-gray-500 mb-2 block";
  const inputStyle =
    "border border-gray-300 rounded-lg p-2 w-full disabled:bg-gray-100 disabled:cursor-not-allowed";

  return (
    <div className="flex flex-col gap-6">
      <h4>Add Discount - {bill?.service}</h4>

      <div>
        <label className={labelStyle} htmlFor="Discount Type">
          {" "}
          Discount Type
        </label>
        <div className="flex items-center gap-3">
          <input type="radio" />
          Percentage
        </div>
        <div className="flex items-center gap-3">
          <input type="radio" />
          Amount
        </div>
      </div>
      <div>
        <label className={labelStyle}>Discount Amount</label>
        <input
          type="number"
          min={0}
          value="Ghs"
          // onChange={(e) => setAmount(e.target.value)}
          className={inputStyle}
        />
      </div>
      <CompanyThemedButton>Add Discount</CompanyThemedButton>
    </div>
  );
}

export default AddDiscount;
