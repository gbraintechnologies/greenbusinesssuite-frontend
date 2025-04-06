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
import { Select, SelectItem } from "@nextui-org/select";

import "../../billings/_components/index.css";

function CreateBill() {
  const labelStyle = "text-sm text-gray-500 mb-2 block";
  const inputStyle =
    "border border-gray-300 rounded-lg p-2 w-full disabled:bg-gray-100 disabled:cursor-not-allowed";

  const { companyBranding: company } = useCompany();
  //pagination
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(50);

  const { data: customers, isLoading } = useQuery({
    queryKey: ["all customers", company?.id, page, limit],
    queryFn: services.companyCustomersWithFormCount(company?.id, page, limit),
    select: (data) => data?.userFormStatList,
  });

  const [selectedForm, setSelectedForm] = useState<any>(null);

  const [amount, setAmount] = useState<any>(0);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const status: any = [];

  const { data: formss, isLoading: isFormsLoading } = useQuery({
    queryKey: ["get company forms for ", Number(company?.id), page, limit],
    queryFn: services.getFormsByCompanyId(company?.id, page, limit),
  });
  let forms: any = [];

  const paymentMethods = ["mobile-money", "card"];

  return (
    <div className="flex flex-col gap-5">
      <h4 className="text-lg font-semibold">Add Payment</h4>

      {/* Select Service */}
      <div>
        <label className={labelStyle}>Select Service</label>
        <Autocomplete
          variant="flat"
          isLoading={isFormsLoading}
          className="bg-white flex  items-center justify-between shadow-none border rounded-xl px-2 w-full text-left"
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
        <label className={labelStyle}>Application Fee</label>
        <h4 className="text-lg font-semibold">Ghs 150.00</h4>
      </div>

      <div>
        <label className={labelStyle}>Select Customer</label>
        <Select
          onChange={(e) => setSelectedCustomer(e.target.value)}
          className="w-full border border-gray-200 rounded-xl"
        >
          {status.map((option: any) => (
            <SelectItem key={option}>{option}</SelectItem>
          ))}
        </Select>
      </div>

      <div>
        <label className={labelStyle}>Payment Method</label>
        <Select
          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
          className="w-full border border-gray-200 rounded-xl"
        >
          {paymentMethods.map((option: any) => (
            <SelectItem key={option}>{option}</SelectItem>
          ))}
        </Select>
      </div>

      <div>
        <label className={labelStyle}>Transaction ID</label>
        <input
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          className={inputStyle}
        />
      </div>

      <CompanyThemedButton>Add Payment</CompanyThemedButton>
    </div>
  );
}

export default CreateBill;
