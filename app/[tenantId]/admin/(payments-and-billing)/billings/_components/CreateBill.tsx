"use client";

import CompanyThemedButton from "@/components/Buttons/CompanyThemedButton";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import useCompany from "@/hooks/useCompany";
import services from "@/services";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteSection,
} from "@nextui-org/autocomplete";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Select, SelectItem } from "@nextui-org/select";

import { toast } from "sonner";

import "./index.css";

function CreateBill({ onClose }: { onClose: any }) {
  const labelStyle = "text-sm text-gray-500 mb-2 block";
  const inputStyle =
    "border border-gray-300 rounded-lg p-2 w-full disabled:bg-gray-100 disabled:cursor-not-allowed";

  const { companyBranding: companyData } = useCompany();

  //pagination
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(50);

  const [selectedForm, setSelectedForm] = useState<any>(null);

  const [amount, setAmount] = useState<any>(0);
  const [selectedBillingType, setSelectedBillingType] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<string[]>([
    "MOBILE_MONEY",
  ]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const queryClient = useQueryClient();

  const billingTypes = ["One off bill", "Recurring bill"];
  const status = ["Active", "Inactive"];

  const { data: forms, isLoading } = useQuery({
    queryKey: ["get company forms for ", Number(companyData?.id), page, limit],
    queryFn: services.getFormsByCompanyId(companyData?.id, page, limit),
  });

  const [loading, setLoading] = useState(false);

  const createBill = () => {
    setLoading(true);
    services
      .createBill({
        formId: selectedForm,
        serviceName: forms?.content.filter(
          (item: any) => item?.id == selectedForm
        )[0]?.name,
        billingType: selectedBillingType.toUpperCase().replaceAll(" ", "_"),
        currency: "GHS",
        amount: amount,
        frequency: "WEEKLY",
        paymentMethod: paymentMethods.toString(),
        status: selectedStatus.toUpperCase(),
      })
      .then((res) => {
        toast.success("Successfully created bill");
        queryClient.invalidateQueries();
        setLoading(false);
        onClose();
      })
      .catch((e) => {
        console.log("Error creating bill", e);
        setLoading(false);
        toast.error("Error creating bill");
      });
  };

  return (
    <div className="flex flex-col gap-5">
      <h4 className="text-lg font-semibold">Create New Bill</h4>

      {/* Select Service */}
      <div>
        <label className={labelStyle}>Select Service</label>
        <Autocomplete
          variant="flat"
          isLoading={isLoading}
          className="bg-white flex  items-center justify-between shadow-none border rounded-xl px-2 w-full text-left"
          scrollShadowProps={{
            isEnabled: false,
          }}
          onSelectionChange={(key) => {
            setSelectedForm(key);
          }}
        >
          <AutocompleteSection className="shadow-md bg-white border border-[#F1F5F9] rounded-lg w-full flex flex-col gap-3">
            {!isLoading &&
              !!forms?.content &&
              forms?.content
                ?.filter((item: any) => item.isAnonymous == false)
                .map((form: any) => (
                  <AutocompleteItem
                    key={form?.id}
                    className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
                  >
                    {form?.name}
                  </AutocompleteItem>
                ))}
          </AutocompleteSection>
        </Autocomplete>
      </div>

      <div>
        <label className={labelStyle}>Billing Type</label>
        <Select
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
            disabled
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
        </div>
        <div className="flex items-center gap-2">
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
        {loading ? "Please wait..." : "Create Bill"}
      </CompanyThemedButton>
    </div>
  );
}

export default CreateBill;
