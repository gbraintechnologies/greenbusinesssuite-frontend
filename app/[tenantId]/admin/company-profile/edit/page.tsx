"use client";
import "./index.css";
import Modal from "@/components/Modal/Modal";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import { CompanyInfo, CustomField } from "@/types";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import { FormikHelpers } from "formik";
import { toast } from "sonner";
import useFileUpload from "@/hooks/useFileUpload";
import { editCompanyWithCustomFields } from "@/services/features/companyService";
import { searchUsersByEmail } from "@/services/features/userManagementService";
import { profile } from "console";
import { isConvertibleToNumber } from "@/utils/IsNumber/IsNumber";
import CompanyForm, { ICompany } from "../components/CompanyForm";
import useCompany from "@/hooks/useCompany";

const Page = () => {
    const {companyBranding} = useCompany();


  const {
    data: companyData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["company ", companyBranding?.id],
    queryFn: services.getCompanyById(Number(companyBranding?.id)),
    enabled: !!companyBranding?.id,
  });

  const companyDescription =
    companyData?.company_custom_values?.find(
      (field: any) => field.custom_profile_item_id == 1
    )?.value ?? "";

  const companyAdminName =
    companyData?.company_custom_values?.find(
      (field: any) => field.custom_profile_item_id == 2
    )?.value ?? "";

  const companyAdminEmail =
    companyData?.company_custom_values?.find(
      (field: any) => field.custom_profile_item_id == 3
    )?.value ?? "";

  const companySubSector =
    companyData?.company_custom_values?.find(
      (field: any) => field.custom_profile_item_id == 4
    )?.value ?? "";

  const companyParentAddressId =
    companyData?.company_custom_values?.find(
      (field: any) => field.custom_profile_item_id == 5
    )?.value ?? "";

  const companyChildAddressId =
    companyData?.company_custom_values?.find(
      (field: any) => field.custom_profile_item_id == 6
    )?.value ?? "";

  const companySectorId =
    companyData?.company_custom_values?.find(
      (field: any) => field.custom_profile_item_id == 7
    )?.value ?? "";

  // const { data: country, isLoading: isCountryLoading } = useQuery({
  //   queryKey: ["country", companyData?.company_address],
  //   queryFn: services.getJurisdictionEntriesById(
  //     Number(companyData?.company_address)
  //   ),
  //   enabled:
  //     !!companyData?.company_address &&
  //     isConvertibleToNumber(companyData?.company_address),
  // });

  // const { data: industry, isLoading: isIndustryLoading } = useQuery({
  //   queryKey: ["industry", companyData?.industry],
  //   queryFn: services.getSubSectorByID(
  //     Number(companySectorId),
  //     Number(companyData?.industry)
  //   ),
  //   enabled:
  //     !!companyData?.industry &&
  //     !!companySectorId &&
  //     isConvertibleToNumber(companyData?.industry),
  // });

  const [showCancelModal, setShowCancelModal] = useState(false);

  const [selectedIndustry, setSelectedIndustry] = useState<
    | {
        label: string;
        value: string;
      }
    | undefined
  >();

  const [selectedJurisdiction, setSelectedJurisdiction] = useState<
    | {
        label: string;
        value: string;
      }
    | undefined
  >();

  const [selectedSubJurisdiction, setSelectedSubJurisdiction] = useState<
    | {
        label: string;
        value: string;
      }
    | undefined
  >();

  const [selectedSubLevel, setSelectedSubLevel] = useState<
    | {
        label: string;
        value: string;
      }
    | undefined
  >();

  const [selectedSubSector, setSelectedSubSector] = useState<
    | {
        label: string;
        value: string;
      }
    | undefined
  >();

  const [sectorId, setSectorId] = useState<number | string>("");

  const [phone, setPhone] = useState(companyData?.primary_contact_phone_number);

  const [companyLogo, setCompanyLogo] = useState<File | null>(null);

  const [backgroundImageUrl, setBackgroundImageUrl] = useState(
    companyData?.company_logo
  );

  const [companySmallLogo, setCompanySmallLogo] = useState<File | null>(null);

  const [smallLogoUrl, setSmallLogoUrl] = useState("");

  const [parentAddressScheme, setParentAddressScheme] = useState<any>();

  const [color, setColor] = useState<string>("");

  const [initialLoad, setInitialLoad] = useState<boolean>(true);

  const [selectedAdminOption, setSelectedAdminOption] = useState<any>();

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

  const hasAdminInfoChanged = (initialValues: any, values: any) => {
    if (
      hasValueChanged(
        `${initialValues.adminFirstName} ${initialValues.adminLastName}`,
        `${values.adminFirstName} ${values.adminLastName}`
      )
    ) {
      return true;
    }

    if (hasValueChanged(initialValues["adminEmail"], values["adminEmail"])) {
      return true;
    }
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

    // if (!selectedJurisdiction?.value) {
    //   toast.error("Jurisdiction is required");
    //   setSubmitting(false);
    //   return;
    // }

    // if (!selectedSubJurisdiction?.value) {
    //   toast.error("Sub Jurisdiction is required");
    //   setSubmitting(false);
    //   return;
    // }

    // if (!selectedSubLevel?.value) {
    //   toast.error("Sub Level is required");
    //   setSubmitting(false);
    //   return;
    // }

    // if (!selectedIndustry?.value) {
    //   toast.error("Industry is required");
    //   setSubmitting(false);
    //   return;
    // }

    // if (!selectedSubSector?.value) {
    //   toast.error("Sub Sector is required");
    //   setSubmitting(false);
    //   return;
    // }

    if (!color) {
      toast.error("Color is required");
      setSubmitting(false);
      return;
    }

    if (!smallLogoUrl) {
      toast.error("Small Logo is required");
      setSubmitting(false);
      return;
    }

    if (!backgroundImageUrl) {
      toast.error("Logo is required");
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
      company_address: selectedJurisdiction?.value as string,
      primary_currency: "GHS",
      company_code: values.companyName?.slice(0, 3).toLowerCase() + Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    };

    const custom_fields: CustomField[] = [
      {
        //Company Description
        custom_profile_item_id: 1,
        value: values.companyDescription as string,
      },
      // {
      //   //Admin Name
      //   custom_profile_item_id: 2,
      //   value: `${values.adminFirstName} ${values.adminLastName}`,
      // }
      // {
      //   //Admin Email
      //   custom_profile_item_id: 3,
      //   value: values.adminEmail as string,
      // },
      // {
      //   // Sub Sector ID
      //   custom_profile_item_id: 4,
      //   value: selectedSubSector?.value as string,
      // },
      // {
      //   // Parent Address Scheme ID
      //   custom_profile_item_id: 5,
      //   value: selectedSubJurisdiction?.value as string,
      // },
      // {
      //   //Child Address Scheme ID
      //   custom_profile_item_id: 6,
      //   value: selectedSubLevel?.value as string,
      // },
      // {
      //   // Sector ID
      //   custom_profile_item_id: 7,
      //   value: sectorId as string,
      // },
    ];

    try {
      const custom_values_field = "company_custom_values";

      let allCustomFields = companyData[custom_values_field];
  
      delete companyData[custom_values_field];

      const updatedCustomFields = allCustomFields.map((field: any) => 
        field.custom_profile_item_id === 1 
          ? { ...field, ...custom_fields.find(f => f.custom_profile_item_id === 1) }
          : field
      );
      
      if (!allCustomFields.some((field: any) => field.custom_profile_item_id === 1)) {
        updatedCustomFields.push(...custom_fields);
      }

      await editCompanyWithCustomFields(companyData?.id, {...companyData,...data}, updatedCustomFields)

      // if (hasAdminInfoChanged(initialValues, values)) {
      //   const userResponse = await searchUsersByEmail(
      //     values.adminEmail as string
      //   );
      //   const userData = userResponse?.data[0];

      //   const editedUserData = {
      //     first_name: values.adminFirstName as string,
      //     last_name: values.adminLastName as string,
      //     email: userData?.email,
      //     username: userData?.username,
      //     phone_number: userData?.phone_number,
      //     mobile_phone_number: userData?.mobile_phone_number,
      //     user_status: userData?.user_status,
      //   };

      //   const custom_profiles = [
      //     {
      //       custom_profile_item_id: 1,
      //       value:
      //         userData?.custom_profile_values?.find(
      //           (profile: any) => profile.custom_profile_item_id === 1
      //         )?.value ?? "",
      //     },
      //     {
      //       custom_profile_item_id: 2,
      //       value: userData?.custom_profile_values?.find(
      //         (profile: any) => profile.custom_profile_item_id === 2
      //       )?.value,
      //     },
      //   ];

      //   await services.editUserWithCustomFields(
      //     editedUserData,
      //     custom_profiles,
      //     userData?.id
      //   );

      // }

      const companySmallLogoURL =
        companySmallLogo && (await handleFileUpload(companySmallLogo as File));

      await services.editCompanyBranding(
        companyData?.id,
        companyData?.company_identifier,
        companySmallLogo
          ? companySmallLogoURL?.file_url
          : companyBranding?.logo,
        color,
        companyData?.company_name
      );

      toast.success(`Company ${companyData?.company_name} edited successfully`);
      // router.back();
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  // useEffect(() => {
  //   if (!companyData) return;
  //   setParentAddressScheme(
  //     country?.parentAddressScheme?.entries?.find(
  //       (entry: any) => entry?.id == companyParentAddressId
  //     )
  //   );
  // }, [companyData, country]);

  useEffect(() => {
    if (companyData) {
      {
        /* SETTING INITIAL VALUES*/
      }
      const phoneNumber = companyData?.primary_contact_phone_number;
      setPhone(phoneNumber);

      // setSelectedIndustry({
      //   label: isConvertibleToNumber(companyData?.industry)
      //     ? industry?.sector?.parentSector
      //     : companyData?.industry,
      //   value: companyData?.industry,
      // });
      // if (companySubSector) {
      //   setSelectedSubSector({
      //     label: companySubSector,
      //     value: companySubSector,
      //   });
      // }

      // if (companyParentAddressId) {
      //   setSelectedJurisdiction({
      //     label: country?.name,
      //     value: companyData?.company_address,
      //   });
      // }

      // if (companyParentAddressId) {
      //   setSelectedSubJurisdiction({
      //     label: country?.parentAddressScheme?.entries?.find(
      //       (entry: any) => entry?.id == companyParentAddressId
      //     )?.name,
      //     value: companyParentAddressId,
      //   });
      // }

      // if (companyChildAddressId) {
      //   setSelectedSubLevel({
      //     label: country?.parentAddressScheme?.entries
      //       ?.find((entry: any) => entry?.id == companyParentAddressId)
      //       ?.childEntries?.find(
      //         (entry: any) => entry?.id == companyChildAddressId
      //       )?.name,
      //     value: companyChildAddressId,
      //   });
      // }

      // if (companySectorId) {
      //   setSectorId(companySectorId);
      // }

      if (companyBranding) {
        setColor(companyBranding?.color);
        setSmallLogoUrl(companyBranding?.logo);
      }

      setBackgroundImageUrl(companyData?.company_logo);
    }
  }, [companyData, companyBranding]);

  return (
    <div className="px-5 pb-20 pt-5">
      <div>
        {isLoading ? (
          <div className="h-[20rem] flex items-center justify-center">
          <div>
            <LoadingIcon />
            <p className="mt-2 text-xs text-gray-500">Fetching company details</p>
          </div>
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
            selectedJurisdiction={selectedJurisdiction}
            setSelectedJurisdiction={setSelectedJurisdiction}
            selectedSubJurisdiction={selectedSubJurisdiction}
            setSelectedSubJurisdiction={setSelectedSubJurisdiction}
            selectedSubLevel={selectedSubLevel}
            setSelectedSubLevel={setSelectedSubLevel}
            selectedSubSector={selectedSubSector}
            setSelectedSubSector={setSelectedSubSector}
            sectorId={sectorId}
            setSectorId={setSectorId}
            initialLoad={initialLoad}
            setInitialLoad={setInitialLoad}
            color={color}
            setColor={setColor}
            selectedAdminOption={selectedAdminOption}
            setSelectedAdminOption={setSelectedAdminOption}
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
