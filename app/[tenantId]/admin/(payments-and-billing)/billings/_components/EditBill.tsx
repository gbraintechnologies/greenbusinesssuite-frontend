"use client";

import CompanyThemedButton from "@/components/Buttons/CompanyThemedButton";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import useCompany from "@/hooks/useCompany";
import services from "@/services";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteSection,
} from "@heroui/autocomplete";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Select, SelectItem } from "@heroui/select";

import { toast } from "sonner";

import "./index.css";

function EditBill({
  bill,
  onClose,
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
  onClose: any;
}) {
  const labelStyle = "text-sm text-gray-500 mb-2 block";
  const inputStyle =
    "border border-gray-300 rounded-lg p-2 w-full disabled:bg-gray-100 disabled:cursor-not-allowed";

  const [amount, setAmount] = useState<any>(bill?.amount);
  const [selectedBillingType, setSelectedBillingType] = useState(
    bill?.billingType?.toLowerCase().replaceAll("_", " ")
  );

  const [paymentMethods, setPaymentMethods] = useState<string[]>(
    bill?.paymentMethods!
  );
  const [selectedStatus, setSelectedStatus] = useState(
    bill?.status.toLowerCase()
  );
  const queryClient = useQueryClient();

  const billingTypes = ["one off bill", "recurring bill"];
  const status = ["active", "inactive"];

  const [loading, setLoading] = useState(false);

  const createBill = () => {
    //
    setLoading(true);
    services
      .updateBill({
        id: bill?.id,
        formId: bill?.formId,
        serviceName: bill?.serviceName,
        billingType: selectedBillingType!.toUpperCase().replaceAll(" ", "_"),
        currency: "GHS",
        amount: amount,
        frequency: "WEEKLY",
        paymentMethods: paymentMethods,
        status: selectedStatus!.toUpperCase(),
      })
      .then((res) => {
        toast.success("Successfully updated bill");
        queryClient.invalidateQueries();
        setLoading(false);
        onClose();
      })
      .catch((e) => {
        console.log("Error updating bill", e);
        setLoading(false);
        toast.error("Error updating bill");
      });
  };

  return (
    <div className="flex flex-col gap-5">
      <h4 className="text-lg font-semibold">
        Editing Bill: {bill?.serviceName}
      </h4>

      {/* Select Service */}
      <div>
        <label className={labelStyle}>Select Service</label>
        <input
          type="text"
          disabled
          value={bill?.serviceName}
          className={inputStyle}
        />
      </div>

      <div>
        <label className={labelStyle}>Billing Type</label>
        <Select
          value={selectedBillingType}
          defaultSelectedKeys={selectedBillingType}
          onChange={(e) => setSelectedBillingType(e.target.value)}
          className="w-full border border-gray-200 rounded-xl"
        >
          {billingTypes.map((option) => (
            <SelectItem key={option}>{option}</SelectItem>
          ))}
        </Select>
      </div>

      <div>
        <label className={labelStyle}>Currency</label>
        <input
          type="text"
          min={0}
          disabled
          value="Ghs"
          // onChange={(e) => setAmount(e.target.value)}
          className={inputStyle}
        />
      </div>

      <div>
        <label className={labelStyle}>Amount</label>
        <input
          type="number"
          min={0}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={inputStyle}
        />
      </div>

      <div>
        {" "}
        <label className={labelStyle}>Payment Methods</label>
        <div className="flex items-center gap-2">
          <input
            checked={paymentMethods.includes("MOBILE_MONEY")}
            onChange={(e) => {
              const isChecked = e.target.checked;
              const value = e.target.value.toUpperCase();

              if (isChecked) {
                setPaymentMethods((prev) => [...prev, value]);
              } else {
                setPaymentMethods(
                  paymentMethods.filter((item) => item !== value)
                );
              }
            }}
            type="checkbox"
            value="mobile_money"
            name="mobile_money"
          />
          Mobile Money
        </div>
        {/* <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={paymentMethods.includes("CREDIT_DEBIT_CARD")}
            onChange={(e) => {
              const isChecked = e.target.checked;
              const value = e.target.value.toUpperCase();

              if (isChecked) {
                setPaymentMethods((prev) => [...prev, value]);
              } else {
                setPaymentMethods(
                  paymentMethods.filter((item) => item !== value)
                );
              }
            }}
            value="CREDIT_DEBIT_CARD"
            name="CREDIT_DEBIT_CARD"
          />
          Credit / Debit Card
        </div> */}
        {/* <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={paymentMethods.includes("BANK_TRANSFER")}
            onChange={(e) => {
              const isChecked = e.target.checked;
              const value = e.target.value.toUpperCase();

              if (isChecked) {
                setPaymentMethods((prev) => [...prev, value]);
              } else {
                setPaymentMethods(
                  paymentMethods.filter((item) => item !== value)
                );
              }
            }}
            value="BANK_TRANSFER"
            name="BANK_TRANSFER"
          />
          Bank Transfer
        </div> */}
      </div>

      <div>
        {" "}
        <label className={labelStyle}>Status</label>
        <Select
          value={status}
          defaultSelectedKeys={status}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full border border-gray-200 rounded-xl"
        >
          {status.map((option) => (
            <SelectItem key={option}>{option}</SelectItem>
          ))}
        </Select>
      </div>

      <CompanyThemedButton
        onPress={createBill}
        isDisabled={
          loading ||
          selectedStatus == "" ||
          selectedBillingType == "" ||
          amount == 0
        }
        isLoading={loading}
      >
        {loading ? "Please wait..." : "Update Bill"}
      </CompanyThemedButton>
    </div>
  );
}

export default EditBill;
