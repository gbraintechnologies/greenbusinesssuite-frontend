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
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

function CreateBill() {
  const labelStyle = "text-sm text-gray-500 mb-2 block";
  const inputStyle = "border border-gray-300 rounded-lg p-2 w-full";

  const { companyBranding: companyData } = useCompany();

  //pagination
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(50);

  const [selectedForm, setSelectedForm] = useState<any>(null);

  const [amount, setAmount] = useState<any>(0);

  const billingTypes = ["one-off-bill", "recurring"];
  const status = ["active", "inactive"];

  const { data: formss, isLoading: isFormsLoading } = useQuery({
    queryKey: ["get company forms for ", Number(companyData?.id), page, limit],
    queryFn: services.getFormsByCompanyId(companyData?.id, page, limit),
  });
  let forms: any = [];
  console.log("forms", forms, isFormsLoading);

  return (
    <div className="flex flex-col gap-5">
      <h4 className="text-lg font-semibold">Create New Bill</h4>

      {/* Select Service */}
      <div>
        <label className={labelStyle}>Select Service</label>
        <Autocomplete
          variant="flat"
          isLoading={isFormsLoading}
          className="bg-white flex items-center justify-between shadow-none border rounded-xl px-2 w-full text-left"
          scrollShadowProps={{
            isEnabled: false,
          }}
          onSelectionChange={(key) => {
            setSelectedForm(key);
          }}
        >
          <AutocompleteSection className="shadow-md bg-white border border-[#F1F5F9] rounded-lg w-full flex flex-col gap-3">
            {forms &&
              forms.content?.map((form: any) => (
                <AutocompleteItem
                  key={form?.responseId}
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
        <select className={inputStyle}>
          <option value="">Select billing type</option>
          {billingTypes.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelStyle}>Currency</label>
        <p className={inputStyle}>Ghc</p>
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
          <input type="checkbox" value="Mobile" name="mobile_money" />
          Mobile Money
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" value="card" name="card" />
          Credit / Debit Card
        </div>
      </div>

      <div>
        {" "}
        <label className={labelStyle}>Status</label>
        <select className={inputStyle}>
          <option value="">Select Status</option>
          {status.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <CompanyThemedButton>Create Bill</CompanyThemedButton>
    </div>
  );
}

export default CreateBill;
