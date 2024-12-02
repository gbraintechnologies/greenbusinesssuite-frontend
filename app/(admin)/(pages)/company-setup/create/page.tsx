"use client";
import "./index.css";
import Modal from "@/components/Modal/Modal";
import { FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import * as Yup from "yup";
import useFileUpload from "@/hooks/useFileUpload";
import { toast } from "sonner";
import { createCompanyWithCustomFields } from "@/services/features/companyService";
import { CompanyInfo } from "@/types";
import CompanyForm from "../components/CompanyForm";
import services from "@/services";
import { useQuery } from "@tanstack/react-query";
import { lowerCaseNoSpace } from "@/utils/LowerCaseNoSpace/LowerCaseNoSpace";


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
  // adminFirstName: Yup.string().required("First name is required"),
  // adminLastName: Yup.string().required("Last name is required"),
  // adminEmail: Yup.string().email("Invalid email").required("Email is required"),
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

  const [selectedCountry, setSelectedCountry] = useState<{
    label: string;
    value: string;
  }>();

  const [selectedParentLevel, setSelectedParentLevel] = useState<{
    label: string;
    value: string;
  }>();

  const [selectedChildLevel, setSelectedChildLevel] = useState<{
    label: string;
    value: string;
  }>();

  const [selectedSubSector, setSelectedSubSector] = useState<{
    label: string;
    value: string;
  }>();

  const [sectorId, setSectorId] = useState<number | string>("");

  const [phone, setPhone] = useState("");

  const [companyLogo, setCompanyLogo] = useState<File | null>(null);

  const [backgroundImageUrl, setBackgroundImageUrl] = useState("");

  const [companySmallLogo, setCompanySmallLogo] = useState<File | null>(null);

  const [smallLogoUrl, setSmallLogoUrl] = useState("");

  const [color, setColor] = useState<string>("");

  const [initialLoad, setInitialLoad] = useState<boolean>(false);

  const [currencyId, setCurrencyId] = useState<string>("");

  const router = useRouter();

  const initialValues: Partial<ICompany> = {
    companyName: "",
    companyDescription: "",
    contactFirstName: "",
    contactLastName: "",
    contactEmail: "",
  };

  const { handleFileUpload } = useFileUpload();

  const createCompany = async (
    values: Partial<ICompany>,
    { resetForm, setSubmitting }: FormikHelpers<Partial<ICompany>>
  ) => {
    if(!currencyId){
      toast.error(`Please set up the currency for ${selectedCountry?.label} to proceed`);
      setSubmitting(false);
      return;
    }
    // phone number required
    if (!(phone.length > 4)) {
      toast.error("Phone number is required");
      setSubmitting(false);
      return;
    }

    // company logo is required
    if(!companyLogo) {
      toast.error("Company logo is required");
      setSubmitting(false);
      return;
    }

    // company small logo is required
    if (!companySmallLogo) {
      toast.error("Company small logo is required");
      setSubmitting(false);
      return;
    }

    // country required
    if (!selectedCountry?.value) {
      toast.error("Jurisdiction is required");
      setSubmitting(false);
      return;
    }


    if (!selectedParentLevel?.value) {
      toast.error("Sub Jurisdiction is required");
      setSubmitting(false);
      return;
    }

    if (!selectedChildLevel?.value) {
      toast.error("Sub Level is required");
      setSubmitting(false);
      return;
    }

    if (!selectedIndustry?.value) {
      toast.error("Industry is required");
      setSubmitting(false);
      return;
    }

    if (!selectedSubSector?.value) {
      toast.error("Sub Sector is required");
      setSubmitting(false);
      return;
    }

    const companyLogoURL =
      companyLogo && (await handleFileUpload(companyLogo as File));

      // 
    const data: CompanyInfo = {
      company_name: values.companyName as string,
      primary_contact_name: `${values.contactFirstName} ${values.contactLastName}`,
      primary_contact_email: values.contactEmail as string,
      primary_contact_phone_number: phone,
      company_logo: companyLogoURL?.file_url || "",
      industry: selectedIndustry?.value as string,
      company_address: selectedCountry?.value as string,
      primary_currency: currencyId,
      company_code: String(Math.floor(Math.random() * 10000)).padStart(4, '0')
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
        // @ts-ignore
        // value: `${selectedAdminOption?.first_name} ${selectedAdminOption?.last_name}`,
        value: "",
      },
      {
        //Admin Email
        custom_profile_item_id: 3,
        // @ts-ignore
        // value: selectedAdminOption?.email as string,
        value: "",
      },
      {
        // Sub Sector ID
        custom_profile_item_id: 4,
        value: selectedSubSector?.value as string,
      },
      {
        // Parent Address Scheme ID
        custom_profile_item_id: 5,
        value: selectedParentLevel?.value as string,
      },
      {
        //Child Address Scheme ID
        custom_profile_item_id: 6,
        value: selectedChildLevel?.value as string,
      },
      {
        // Sector ID
        custom_profile_item_id: 7,
        value: sectorId as string,
      },
    ];

    // const adminData = {
    //   email: values.adminEmail as string,
    //   username: ((values.adminFirstName?.toLowerCase() as string) +
    //     values.adminLastName?.toLowerCase()) as string,
    //   first_name: values.adminFirstName as string,
    //   last_name: values.adminLastName as string,
    //   phone_number: "+233",
    //   mobile_phone_number: "+233",
    //   user_status: "ACTIVE",
    // };

    try {
      const companyData = await createCompanyWithCustomFields(
        data,
        custom_fields
      );

      const companySmallLogoURL =
        companySmallLogo && (await handleFileUpload(companySmallLogo as File));

      await services.createCompanyBranding(
        companyData?.id,
        companyData?.company_identifier,
        companySmallLogoURL?.file_url,
        color,
        companyData?.company_name
      );

      toast.success("Company created successfully");

      // const custom_profiles = [
      //   {
      //     custom_profile_item_id: 2,
      //     value: await createCompanyResponse?.id,
      //   },
      // ];

      // TODO: No need to create new admin
      // const createUserResponse = await services.createUserWithCustomProfiles(
      //   adminData,
      //   custom_profiles
      // );
      // toast.success("Admin created successfully successfully");

      // ROLE ID: 6 for company admin
      // await services.assignRoleToUser(createUserResponse.data.id, 6);

      // setPhone("");
      // setSelectedIndustry(undefined);
      // setSelectedCountry(undefined);
      // setCompanyLogo(null);
      // setCompanySmallLogo(null);
      // setSmallLogoUrl("");
      // setBackgroundImageUrl("");
      // resetForm();

      // go to the configuration setup page
      router.push(`/company-setup/configure?id=${companyData?.id}`);
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
          companySmallLogo={companySmallLogo}
          setCompanySmallLogo={setCompanySmallLogo}
          smallLogoUrl={smallLogoUrl}
          setSmallLogoUrl={setSmallLogoUrl}
          backgroundImageUrl={backgroundImageUrl}
          setBackgroundImageUrl={setBackgroundImageUrl}
          phone={phone}
          setPhone={setPhone}
          selectedIndustry={selectedIndustry}
          setSelectedIndustry={setSelectedIndustry}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          selectedParentLevel={selectedParentLevel}
          setSelectedParentLevel={setSelectedParentLevel}
          selectedChildLevel={selectedChildLevel}
          setSelectedChildLevel={setSelectedChildLevel}
          selectedSubSector={selectedSubSector}
          setSelectedSubSector={setSelectedSubSector}
          sectorId={sectorId}
          setSectorId={setSectorId}
          initialLoad={initialLoad}
          setInitialLoad={setInitialLoad}
          color={color}
          setColor={setColor}
          currencyId={currencyId}
          setCurrencyId={setCurrencyId}
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
