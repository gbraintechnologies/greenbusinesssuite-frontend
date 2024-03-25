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

  const { data: companies, isLoading } = useQuery({
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
  console.log("search params ", id);

  console.log("company  ", companyData);
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

  const [phone, setPhone] = useState("");

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

  const { handleFileUpload } = useFileUpload();

  const editCompany = async (
    values: Partial<ICompany>,
    { resetForm, setSubmitting }: FormikHelpers<Partial<ICompany>>
  ) => {
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

    const companyLogoURL = companyLogo
      ? await handleFileUpload(companyLogo as File)
      : companyData?.company_logo;

    const data: CompanyInfo = {
      company_name: values.companyName as string,
      primary_contact_name: `${values.contactFirstName} ${values.contactLastName}`,
      primary_contact_email: values.contactEmail as string,
      primary_contact_phone_number: phone,
      company_logo: companyLogoURL?.file_url || "",
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
      toast.success("Company created successfully");
      resetForm();
    } catch (error) {
      toast.error("An error occurred");
      console.log("error ", error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (companyData) {
      console.log("there is company data...");
      const phoneNumber = companyData?.primary_contact_phone_number.replace(
        "+",
        ""
      );

      console.log("new phone number ", phoneNumber);
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
            logoPresentOnLoad={true}
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
