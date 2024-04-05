"use client";
import "./index.css";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import Modal from "@/components/Modal/Modal";
import { ShowError, getStyles } from "@/utils/FormHelpers/FormHelpers";
import {
  Field,
  Form,
  Formik,
  FormikBag,
  FormikHelpers,
  FormikState,
} from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { HiOutlineInboxArrowDown } from "react-icons/hi2";
import * as Yup from "yup";
import Dropdown from "@/components/Dropdown/Dropdown";
import UploadIcon from "@/public/svg/upload.svg";
import Image from "next/image";
import { PhoneSelector } from "@/components/PhoneSelector/PhoneSelector";
import useFileUpload from "@/hooks/useFileUpload";
import toast from "react-hot-toast";
import {
  createCompanyWithCustomFields,
  getCustomFields,
} from "@/services/features/companyService";
import { CompanyInfo, CompanyObject } from "@/types";
import { createCustomField } from "@/services/features/userManagementService";
import CompanyForm from "../components/CompanyForm";
import services from "@/services";

interface ICompany {
  companyName: string;
  companyDescription: string;
  industry: string;
  jurisdiction: string;
  companyLogo: string;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  contactPhone: string;
}

const companySchema = Yup.object().shape({
  companyName: Yup.string().required("Company name is required"),
  companyDescription: Yup.string().required("Company description is required"),
  adminFirstName: Yup.string().required("First name is required"),
  adminLastName: Yup.string().required("Last name is required"),
  adminEmail: Yup.string().email("Invalid email").required("Email is required"),
  contactFirstName: Yup.string().required("First name is required"),
  contactLastName: Yup.string().required("Last name is required"),
  contactEmail: Yup.string()
    .email("Invalid email")
    .required("Email is required"),
});

const CreateCompany = () => {
  const [showCancelModal, setShowCancelModal] = useState(false);

  const [selectedIndustry, setSelectedIndustry] = useState<{
    label: string;
    value: string;
  }>();

  const [selectedJurisdiction, setSelectedJurisdiction] = useState<{
    label: string;
    value: string;
  }>();

  const [phone, setPhone] = useState("");

  const [companyLogo, setCompanyLogo] = useState<File | null>(null);

  const [backgroundImageUrl, setBackgroundImageUrl] = useState("");

  const router = useRouter();

  const initialValues: Partial<ICompany> = {
    companyName: "",
    companyDescription: "",
    adminFirstName: "",
    adminLastName: "",
    adminEmail: "",
    contactFirstName: "",
    contactLastName: "",
    contactEmail: "",
  };

  const { handleFileUpload } = useFileUpload();

  const createCompany = async (
    values: Partial<ICompany>,
    { resetForm, setSubmitting }: FormikHelpers<Partial<ICompany>>
  ) => {
    if (!(phone.length > 4)) {
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
      primary_contact_name: `${values.contactFirstName} ${values.contactLastName}`,
      primary_contact_email: values.contactEmail as string,
      primary_contact_phone_number: phone,
      company_logo: companyLogoURL?.file_url || "",
      industry: selectedIndustry?.value as string,
      primary_currency: "GHS",
    };

    const custom_fields = [
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

    const adminData = {
      email: values.adminEmail as string,
      username: ((values.adminFirstName?.toLowerCase() as string) +
        values.adminLastName?.toLowerCase()) as string,
      first_name: values.adminFirstName as string,
      last_name: values.adminLastName as string,
      phone_number: "+233",
      mobile_phone_number: "+233",
      user_status: "ACTIVE",
    };

    try {
      const createCompanyResponse = await createCompanyWithCustomFields(
        data,
        custom_fields
      );

      toast.success("Company created successfully");

      const custom_profiles = [
        {
          custom_profile_item_id: 2,
          value: await createCompanyResponse?.id,
        },
      ];
      const createUserResponse = await services.createUserWithCustomProfiles(
        adminData,
        custom_profiles
        );
        toast.success("Admin created successfully successfully");

      const assignRoleResponse = await services.assignRoleToUser(
        createUserResponse.data.id,
        6
      );

      const notifyUserResponse = await services.notifyUserTempCred(
        createUserResponse?.data?.id,
        "EMAIL"
      );

      toast.success(`Temporary password sent to ${adminData.email}`);

      setPhone("");
      setSelectedIndustry(undefined);
      setSelectedJurisdiction(undefined);
      setCompanyLogo(null);
      setBackgroundImageUrl("");
      resetForm();
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-5 pb-20">
      <div>
        <CompanyForm
          headerText="Create A New Company"
          submitFn={createCompany}
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

export default CreateCompany;
