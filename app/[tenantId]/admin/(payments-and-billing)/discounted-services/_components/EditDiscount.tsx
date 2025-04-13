"use client";

import CompanyThemedButton from "@/components/Buttons/CompanyThemedButton";
import services from "@/services";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";

function EditDiscount({
  discount,
  onClose,
}: {
  discount: {
    id: number;
    discountType: string;
    serviceName: string;
    discountValue: number;
    discountPercentage: number;
    isActive: boolean;
    createdOn: Date;
    updatedOn: Date;
  };
  onClose: any;
}) {
  //
  const labelStyle = "text-sm text-gray-500 mb-2 block";
  const inputStyle =
    "border border-gray-300 rounded-lg p-2 w-full disabled:bg-gray-100 disabled:cursor-not-allowed";

  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  console.log("discount", discount);

  const [amount, setAmount] = useState<any>(
    discount?.discountType.toLowerCase() == "percentage"
      ? discount?.discountPercentage
      : discount?.discountValue
  );

  const discountTypes = ["percentage", "amount"];

  const [selectedDiscountType, setSelectedDiscountType] = useState(
    discount?.discountType?.toLowerCase()
  );

  const updateDiscount = () => {
    setLoading(true);
    services
      .updateDiscount({
        id: discount.id,
        discountType: selectedDiscountType.toUpperCase(),
        serviceName: discount.serviceName,
        discountValue: amount,
        isActive: discount.isActive,
      })
      .then((res) => {
        queryClient.invalidateQueries();
        setLoading(false);
        onClose();
        toast.success("Discount updated");
      })
      .catch((e) => {
        console.log("error creating", e);
        setLoading(false);
        toast.error("Error updating discount");
      });
  };

  return (
    <div className="flex flex-col gap-6">
      <h4>Edit Discount</h4>

      <div>
        <label className={labelStyle} htmlFor="Discount Type">
          {" "}
          Discount Type
        </label>
        {discountTypes.map((item) => {
          return (
            <div key={item} className="flex items-center gap-3">
              <input
                checked={selectedDiscountType == item}
                onChange={(e) => {
                  setSelectedDiscountType(e.target.value);
                }}
                name={item}
                value={item}
                type="radio"
              />
              {item}
            </div>
          );
        })}
      </div>
      <div>
        <label className={labelStyle}>
          Discount{" "}
          {selectedDiscountType == "percentage" ? "Percentage" : "Amount"}
        </label>
        <input
          type="number"
          min={0}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={inputStyle}
        />
      </div>
      <CompanyThemedButton
        isLoading={loading}
        isDisabled={loading || amount == 0}
        onPress={updateDiscount}
      >
        {loading ? "Please wait.." : "Edit Discount"}
      </CompanyThemedButton>
    </div>
  );
}

export default EditDiscount;
