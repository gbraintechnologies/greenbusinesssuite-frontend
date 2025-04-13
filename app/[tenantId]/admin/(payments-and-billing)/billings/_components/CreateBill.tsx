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
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const queryClient = useQueryClient();

  const billingTypes = ["One off bill", "Recurring bill"];
  const status = ["Active", "Inactive"];

  const { data: formss, isLoading: isFormsLoading } = useQuery({
    queryKey: ["get company forms for ", Number(companyData?.id), page, limit],
    queryFn: services.getFormsByCompanyId(companyData?.id, page, limit),
  });

  // TODO: hardcoding forms for now; till fix is done.
  let forms: any = [
    {
      "id": 142,
      "name": "End of Month Evaluation ",
      "companyId": 10,
      "url":
        "https://mesh-business-suite-staging.meshapps.io/totalenergiestot214/invite-form?f=142&c=10",
      "description": "No description set",
      "formInstruction": "",

      "userMandatory": false,
      "deadline": null,
      "publishStatus": "PUBLISHED",
      "isDeleted": false,
      "isTemplate": false,
      "layout": "GENERAL",
      "createdOn": "2025-02-28T09:47:32.737382",
      "updatedOn": "2025-03-01T13:09:53.721151",
      "deletedOn": null,
      "assignDate": "2025-02-28T10:40:19.731914",
      "isAnonymous": false,
      "multipleForms": true,
      "redirectUrl": null,
    },
    {
      "id": 139,
      "name": "(Test) Allowing multiple responses",
      "companyId": 10,
      "url": "http://localhost:3000/totalenergiestot214/invite-form?f=139&c=10",
      "description": "No description set",
      "formInstruction": "",

      "userMandatory": false,
      "deadline": null,
      "publishStatus": "UNPUBLISHED",
      "isDeleted": false,
      "isTemplate": false,
      "layout": "GENERAL",
      "createdOn": "2025-02-27T08:34:08.689229",
      "updatedOn": "2025-03-07T15:17:07.80224",
      "deletedOn": null,
      "assignDate": "2025-02-27T08:35:16.947811",
      "isAnonymous": false,
      "multipleForms": true,
      "redirectUrl": null,
    },
    {
      "id": 136,
      "name": "Demo Survey",
      "companyId": 10,
      "url":
        "https://mesh-business-suite-staging.meshapps.io/totalenergiestot214/survey?f=136&c=10",
      "description": "No description set",
      "formInstruction": "",

      "userMandatory": false,
      "deadline": null,
      "publishStatus": "PUBLISHED",
      "isDeleted": false,
      "isTemplate": false,
      "layout": "GENERAL",
      "createdOn": "2025-02-11T14:15:16.912116",
      "updatedOn": "2025-02-12T15:05:46.537423",
      "deletedOn": null,
      "assignDate": "2025-02-11T14:17:59.380919",
      "isAnonymous": true,
      "multipleForms": false,
      "redirectUrl": "google.com",
    },
    {
      "id": 135,
      "name": "Public Survey",
      "companyId": 10,
      "url": "http://localhost:3000/totalenergiestot214/survey?f=135&c=10",
      "description": "No description set",
      "formInstruction": "",

      "userMandatory": false,
      "deadline": null,
      "publishStatus": "PUBLISHED",
      "isDeleted": false,
      "isTemplate": false,
      "layout": "GENERAL",
      "createdOn": "2025-02-07T15:03:22.96766",
      "updatedOn": "2025-02-10T21:21:26.996508",
      "deletedOn": null,
      "assignDate": "2025-02-10T17:52:27.337301",
      "isAnonymous": true,
      "multipleForms": false,
      "redirectUrl": "google.com",
    },
    {
      "id": 123,
      "name": "NEW YEAR FORM",
      "companyId": 10,
      "url":
        "https://mesh-business-suite-staging.meshapps.io/totalenergiestot214/invite-form?f=123&c=10",
      "description": "No description set",
      "formInstruction": "",

      "userMandatory": false,
      "deadline": null,
      "publishStatus": "PUBLISHED",
      "isDeleted": false,
      "isTemplate": false,
      "layout": "GENERAL",
      "createdOn": "2025-01-08T10:13:52.369581",
      "updatedOn": "2025-01-08T10:15:49.620193",
      "deletedOn": null,
      "assignDate": "2025-01-08T10:15:08.230328",
      "isAnonymous": false,
      "multipleForms": false,
      "redirectUrl": null,
    },
    {
      "id": 116,
      "name": "Lunch time",
      "companyId": 10,
      "url":
        "https://mesh-business-suite-staging.meshapps.io/totalenergiestot214/invite-form?f=116&c=10",
      "description": "Different foods at great prices",
      "formInstruction": "",

      "userMandatory": false,
      "deadline": null,
      "publishStatus": "PUBLISHED",
      "isDeleted": false,
      "isTemplate": false,
      "layout": "GENERAL",
      "createdOn": "2024-12-16T10:17:41.032784",
      "updatedOn": "2024-12-16T10:20:04.211007",
      "deletedOn": null,
      "assignDate": "2024-12-16T10:20:00.652094",
      "isAnonymous": false,
      "multipleForms": false,
      "redirectUrl": null,
    },
    {
      "id": 115,
      "name": "Shop and Save",
      "companyId": 10,
      "url":
        "https://mesh-business-suite-staging.meshapps.io/totalenergiestot214/invite-form?f=115&c=10",
      "description": "No description set",
      "formInstruction": "",

      "userMandatory": false,
      "deadline": null,
      "publishStatus": "PUBLISHED",
      "isDeleted": false,
      "isTemplate": false,
      "layout": "GENERAL",
      "createdOn": "2024-12-16T09:48:16.38244",
      "updatedOn": "2024-12-16T09:53:45.997383",
      "deletedOn": null,
      "assignDate": "2024-12-16T09:53:37.109833",
      "isAnonymous": false,
      "multipleForms": false,
      "redirectUrl": null,
    },
    {
      "id": 110,
      "name": "Region Test Form",
      "companyId": 10,
      "url":
        "https://mesh-business-suite-staging.meshapps.io/totalenergiestot214/invite-form?f=110&c=10",
      "description": "No description set",
      "formInstruction": "",

      "userMandatory": false,
      "deadline": null,
      "publishStatus": "PUBLISHED",
      "isDeleted": false,
      "isTemplate": false,
      "layout": "GENERAL",
      "createdOn": "2024-11-26T14:38:35.390343",
      "updatedOn": "2024-11-26T14:44:35.709716",
      "deletedOn": null,
      "assignDate": "2024-11-26T14:40:13.998048",
      "isAnonymous": false,
      "multipleForms": false,
      "redirectUrl": null,
    },
    {
      "id": 108,
      "name": "Pic Test",
      "companyId": 10,
      "url":
        "https://mesh-business-suite-staging.meshapps.io/totalenergiestot214/invite-form?f=108&c=10",
      "description": "No description set",
      "formInstruction": "",

      "userMandatory": false,
      "deadline": null,
      "publishStatus": "PUBLISHED",
      "isDeleted": false,
      "isTemplate": false,
      "layout": "GENERAL",
      "createdOn": "2024-11-25T09:07:58.438309",
      "updatedOn": "2024-11-25T09:10:09.019184",
      "deletedOn": null,
      "assignDate": "2024-11-25T09:10:03.99908",
      "isAnonymous": false,
      "multipleForms": false,
      "redirectUrl": null,
    },
    {
      "id": 107,
      "name": "Upload Test",
      "companyId": 10,
      "url":
        "https://mesh-business-suite-staging.meshapps.io/totalenergiestot214/invite-form?f=107&c=10",
      "description": "No description set",
      "formInstruction": "",

      "userMandatory": false,
      "deadline": null,
      "publishStatus": "PUBLISHED",
      "isDeleted": false,
      "isTemplate": false,
      "layout": "GENERAL",
      "createdOn": "2024-11-25T09:02:14.278389",
      "updatedOn": "2024-11-25T09:03:41.235171",
      "deletedOn": null,
      "assignDate": "2024-11-25T09:03:37.746581",
      "isAnonymous": false,
      "multipleForms": false,
      "redirectUrl": null,
    },
  ];

  const [loading, setLoading] = useState(false);

  const createBill = () => {
    //
    console.log(
      "Creating bill with Form: ",
      selectedForm,
      forms.filter((item: any) => item.id == selectedForm)[0].name
    );

    //
    setLoading(true);
    services
      .createBill({
        formId: selectedForm,
        serviceName: forms.filter((item: any) => item?.id == selectedForm)[0]
          ?.name,
        billingType: selectedBillingType.toUpperCase().replaceAll(" ", "_"),
        currency: "GHS",
        amount: amount,
        frequency: "WEEKLY",
        paymentMethods: paymentMethods,
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
          // isLoading={isFormsLoading}
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
              forms
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
        <div className="flex items-center gap-2">
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
        </div>
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
