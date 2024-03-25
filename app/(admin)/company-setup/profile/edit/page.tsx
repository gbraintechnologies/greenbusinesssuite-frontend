"use client";
import "./index.css";
import Modal from "@/components/Modal/Modal";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import CompanyForm, { ICompany } from "../../components/CompanyForm";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import { CompanyInfo, CustomField } from "@/types";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import { FormikHelpers } from "formik";
import toast from "react-hot-toast";
import useFileUpload from "@/hooks/useFileUpload";
import { editCompanyWithCustomFields } from "@/services/features/companyService";

const Page = () => {
  const searchParams = useSearchParams();

  const id = searchParams.get("id");

  const {
    data: companies,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["all companies"],
    queryFn: services.getAllCompanies(),
  });

  const companyData: CompanyInfo = companies?.find(
    (company: CompanyInfo) => company.id === Number(id)
  );

  const companyDescription =
    companyData?.company_custom_values?.find(
      (field) => field.custom_profile_item_id == 1
    )?.value ?? "";

  const companyAdminName =
    companyData?.company_custom_values?.find(
      (field) => field.custom_profile_item_id == 2
    )?.value ?? "";

  const companyAdminEmail =
    companyData?.company_custom_values?.find(
      (field) => field.custom_profile_item_id == 3
    )?.value ?? "";

  const [showCancelModal, setShowCancelModal] = useState(false);

  const [selectedIndustry, setSelectedIndustry] = useState<
    | {
        label: string;
        value: string;
      }
    | undefined
  >({ label: companyData?.industry, value: companyData?.industry });

  const [selectedJurisdiction, setSelectedJurisdiction] = useState<
    | {
        label: string;
        value: string;
      }
    | undefined
  >();

  const [phone, setPhone] = useState(companyData?.primary_contact_phone_number);

  const [companyLogo, setCompanyLogo] = useState<File | null>(null);

  const [backgroundImageUrl, setBackgroundImageUrl] = useState(
    companyData?.company_logo
  );

  const router = useRouter();

  const initialValues: Partial<ICompany> = {
    companyName: companyData?.company_name,
    companyDescription: companyDescription,
    adminFirstName: companyAdminName.split(" ")[0],
    adminLastName: companyAdminName.split(" ")[1],
    adminEmail: companyAdminEmail,
    contactFirstName: companyData?.primary_contact_name.split(" ")[0],
    contactLastName: companyData?.primary_contact_name.split(" ")[1],
    contactEmail: companyData?.primary_contact_email,
  };

  const hasValueChanged = (initialValue: any, newValue: any) =>
    initialValue !== newValue;

  const hasAnyValueChanged = (initialValues: any, values: any) => {
    // Check for simple fields
    const simpleFields = [
      "companyName",
      "companyDescription",
      "adminEmail",
      "contactEmail",
    ];
    for (let field of simpleFields) {
      if (hasValueChanged(initialValues[field], values[field])) {
        return true;
      }
    }

    // Check for combined fields (e.g., names that might be split)
    if (
      hasValueChanged(
        `${initialValues.adminFirstName} ${initialValues.adminLastName}`,
        `${values.adminFirstName} ${values.adminLastName}`
      )
    ) {
      return true;
    }

    if (
      hasValueChanged(
        `${initialValues.contactFirstName} ${initialValues.contactLastName}`,
        `${values.contactFirstName} ${values.contactLastName}`
      )
    ) {
      return true;
    }

    // Check for phone
    if (hasValueChanged(companyData?.primary_contact_phone_number, phone)) {
      return true;
    }

    return false;
  };

  const { handleFileUpload } = useFileUpload();

  const editCompany = async (
    values: Partial<ICompany>,
    { resetForm, setSubmitting }: FormikHelpers<Partial<ICompany>>
  ) => {
    if (!hasAnyValueChanged(initialValues, values)) {
      toast.error("No changes made");
      return;
    }
    if (!(phone?.length > 4)) {
      toast.error("Phone number is required");
      setSubmitting(false);
      return;
    }

    if (!selectedIndustry?.value) {
      toast.error("Industry is required");
      setSubmitting(false);
      return;
    }

    const companyLogoURL =
      companyLogo && (await handleFileUpload(companyLogo as File));

    const data: CompanyInfo = {
      company_name: values.companyName as string,
      status: companyData?.status,
      primary_contact_name: `${values.contactFirstName} ${values.contactLastName}`,
      primary_contact_email: values.contactEmail as string,
      primary_contact_phone_number: phone,
      company_logo: companyLogo
        ? companyLogoURL?.file_url
        : companyData?.company_logo,
      industry: selectedIndustry?.value as string,
      primary_currency: "GHS",
    };

    const custom_fields: CustomField[] = [
      {
        //Company Description
        custom_profile_item_id: 1,
        value: values.companyDescription as string,
      },
      {
        //Admin Name
        custom_profile_item_id: 2,
        value: `${values.adminFirstName} ${values.adminLastName}`,
      },
      {
        //Admin Email
        custom_profile_item_id: 3,
        value: values.adminEmail as string,
      },
    ];

    try {
      const response = await editCompanyWithCustomFields(
        companyData?.id,
        data,
        custom_fields
      );
      toast.success("Company edited successfully");
      router.back();
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (companyData) {
      const phoneNumber = companyData?.primary_contact_phone_number;
      setPhone(phoneNumber);
      setSelectedIndustry({
        label: companyData?.industry,
        value: companyData?.industry,
      });
      setBackgroundImageUrl(companyData?.company_logo);
    }
  }, [companyData]);

  return (
    <div className="px-5 pb-20">
      <div>
        {isLoading ? (
          <div className="w-full h-full flex justify-center items-center">
            <LoadingIcon />
          </div>
        ) : (
          <CompanyForm
            headerText={`Edit ${companyData?.company_name}`}
            logoPresentOnLoad={companyData?.company_logo ? true : false}
            submitFn={editCompany}
            initialValues={initialValues}
            setShowCancelModal={setShowCancelModal}
            companyLogo={companyLogo}
            setCompanyLogo={setCompanyLogo}
            backgroundImageUrl={backgroundImageUrl}
            setBackgroundImageUrl={setBackgroundImageUrl}
            phone={phone}
            setPhone={setPhone}
            selectedIndustry={selectedIndustry}
            setSelectedIndustry={setSelectedIndustry}
            selectedJurisdiction={selectedJurisdiction}
            setSelectedJurisdiction={setSelectedJurisdiction}
          />
        )}
        {/* CANCEL MODAL: DISCARD ALL CHANGES */}
        <Modal
          isOpen={showCancelModal}
          setIsOpen={setShowCancelModal}
          title="Are you sure you want to discard all changes?"
        >
          <div>
            <p className="px-5 mt-5 text-[#334155]">
              Discard changes would delete all the changes you have made. <br />{" "}
              Nothing would be saved.
            </p>

            <div className=" p-5 border-t-[1px] border-t-gray-200 flex bg-[#F1F5F9] justify-between mt-5">
              <button
                onClick={() => setShowCancelModal(false)}
                className="bg-gray-50 border border-gray-200 shadow-md px-8 py-2 flex text-primary-dark text-sm hover:opacity-95 items-center gap-2 rounded-xl"
              >
                Cancel
              </button>
              <button
                className="bg-primary-red py-3 shadow-md flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
                onClick={() => {
                  router.back();
                }}
              >
                Yes, discard changes
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Page;
