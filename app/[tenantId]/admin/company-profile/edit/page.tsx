"use client";
import "./index.css";
import Modal from "@/components/Modal/Modal";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import { CompanyInfo, CustomField } from "@/types";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import { FormikHelpers } from "formik";
import { toast } from "sonner";
import useFileUpload, {
  extractFileUrl,
  isPersistableLogoUrl,
} from "@/hooks/useFileUpload";
import { editCompanyWithCustomFields } from "@/services/features/companyService";

import CompanyForm, { ICompany } from "./../components/CompanyForm";
import useCompany from "@/hooks/useCompany";

const Page = () => {
  const { companyBranding } = useCompany();

  const resolvedCompanyId =
    companyBranding?.companyId ??
    companyBranding?.company_id ??
    null;

  const tenantId = companyBranding?.company_identifier;

  const { data: companyByTenant } = useQuery({
    queryKey: ["company-by-identifier", tenantId],
    queryFn: services.getCompanyByIdentifier(tenantId!),
    enabled: !!tenantId && !resolvedCompanyId,
  });

  const companyId =
    resolvedCompanyId ??
    companyByTenant?.id ??
    companyByTenant?.companyId ??
    companyByTenant?.company_id ??
    null;

  const {
    data: companyData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["company", Number(companyId)],
    queryFn: services.getCompanyById(Number(companyId)),
    enabled: !!companyId,
  });

  const customValues =
    companyData?.company_custom_values ??
    companyData?.companyCustomValues ??
    [];

  const pickCustom = (itemId: number) =>
    customValues.find((field: any) => field.custom_profile_item_id == itemId)
      ?.value ?? "";

  const companyDescription =
    pickCustom(1) || companyData?.description || "";

  const companyAdminName = pickCustom(2);
  const companyAdminEmail = pickCustom(3);
  const companySubSector = pickCustom(4);
  const companyParentAddressId = pickCustom(5);
  const companyChildAddressId = pickCustom(6);
  const companySectorId = pickCustom(7);

  const contactFullName =
    companyData?.primary_contact_name ??
    companyData?.primaryContactName ??
    "";
  const contactNameParts = contactFullName.trim().split(/\s+/);
  const adminNameParts = companyAdminName.trim().split(/\s+/);

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

  const [selectedCountry, setSelectedCountry] = useState<
    | {
        label: string;
        value: string;
      }
    | undefined
  >();

  const [selectedParentLevel, setSelectedParentLevel] = useState<
    | {
        label: string;
        value: string;
      }
    | undefined
  >();

  const [selectedChildLevel, setSelectedChildLevel] = useState<
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

  const [phone, setPhone] = useState(
    companyData?.primary_contact_phone_number ??
      companyData?.primaryContactPhoneNumber ??
      ""
  );

  const [companyLogo, setCompanyLogo] = useState<File | null>(null);

  const [backgroundImageUrl, setBackgroundImageUrl] = useState(
    companyData?.company_logo ?? companyData?.companyLogo ?? ""
  );

  const [companySmallLogo, setCompanySmallLogo] = useState<File | null>(null);

  const [smallLogoUrl, setSmallLogoUrl] = useState("");

  const [parentAddressScheme, setParentAddressScheme] = useState<any>();

  const [color, setColor] = useState<string>("");

  const [initialLoad, setInitialLoad] = useState<boolean>(true);

  const [selectedAdminOption, setSelectedAdminOption] = useState<any>();

  const router = useRouter();

  const initialValues: Partial<ICompany> = {
    companyName:
      companyData?.company_name ?? companyData?.companyName ?? "",
    companyDescription: companyDescription,
    adminFirstName: adminNameParts[0] || "",
    adminLastName: adminNameParts.slice(1).join(" ") || "",
    adminEmail: companyAdminEmail,
    contactFirstName: contactNameParts[0] || "",
    contactLastName: contactNameParts.slice(1).join(" ") || "",
    contactEmail:
      companyData?.primary_contact_email ??
      companyData?.primaryContactEmail ??
      "",
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

    const brandingColor = color || companyBranding?.color || "#1FA35C";
    const existingSmallLogo =
      (isPersistableLogoUrl(smallLogoUrl) ? smallLogoUrl : "") ||
      (isPersistableLogoUrl(companyBranding?.logo)
        ? companyBranding.logo
        : "");
    const existingFullLogo =
      companyData?.company_logo ?? companyData?.companyLogo ?? "";

    if (!brandingColor) {
      toast.error("Color is required");
      setSubmitting(false);
      return;
    }

    if (!existingSmallLogo && !companySmallLogo) {
      toast.error("Small logo is required");
      setSubmitting(false);
      return;
    }

    if (!existingFullLogo && !companyLogo && !backgroundImageUrl) {
      toast.error("Logo is required");
      setSubmitting(false);
      return;
    }

    const companyLogoURL =
      companyLogo && (await handleFileUpload(companyLogo as File));
    const uploadedCompanyLogo = companyLogo
      ? extractFileUrl(companyLogoURL)
      : null;

    const data: CompanyInfo = {
      company_name: values.companyName as string,
      status: companyData?.status,
      primary_contact_name: `${values.contactFirstName} ${values.contactLastName}`,
      primary_contact_email: values.contactEmail as string,
      primary_contact_phone_number: phone,
      company_logo:
        uploadedCompanyLogo ||
        (isPersistableLogoUrl(backgroundImageUrl)
          ? backgroundImageUrl
          : existingFullLogo),
      industry:
        (selectedIndustry?.value as string) ||
        companyData?.industry ||
        "",
      company_address:
        (selectedCountry?.value as string) ||
        companyData?.company_address ||
        companyData?.companyAddress ||
        "",
      primary_currency:
        companyData?.primary_currency ?? companyData?.primaryCurrency,
      company_code:
        companyData?.company_code ??
        companyData?.companyCode ??
        String(Math.floor(Math.random() * 10000)).padStart(4, "0"),
    };

    const custom_fields: CustomField[] = [
      {
        custom_profile_item_id: 1,
        value: values.companyDescription as string,
      },
    ];

    try {
      const allCustomFields = [
        ...(companyData?.company_custom_values ??
          companyData?.companyCustomValues ??
          []),
      ];

      const updatedCustomFields = allCustomFields.map((field: any) =>
        field.custom_profile_item_id === 1
          ? {
              ...field,
              ...custom_fields.find((f) => f.custom_profile_item_id === 1),
            }
          : field
      );

      if (
        !updatedCustomFields.some(
          (field: any) => field.custom_profile_item_id === 1
        )
      ) {
        updatedCustomFields.push(...custom_fields);
      }

      const {
        company_custom_values,
        companyCustomValues,
        ...companyWithoutCustom
      } = companyData || {};

      await editCompanyWithCustomFields(
        companyData?.id,
        { ...companyWithoutCustom, ...data },
        updatedCustomFields
      );

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

      let brandingLogo = existingSmallLogo;

      if (companySmallLogo) {
        const uploaded = await services.uploadBrandingLogo({
          companyId: companyData?.id,
          tenancyId:
            companyData?.company_identifier ??
            companyData?.companyIdentifier,
          file: companySmallLogo as File,
        });
        brandingLogo = extractFileUrl(uploaded) || brandingLogo;
      }

      if (!brandingLogo && companySmallLogo) {
        toast.error("Logo upload failed. Please try again.");
        setSubmitting(false);
        return;
      }

      const brandingRecordId =
        companyBranding?.brandingId ?? companyBranding?.id;
      const tenancyId =
        companyData?.company_identifier ??
        companyData?.companyIdentifier ??
        companyBranding?.company_identifier;
      const logoValue = brandingLogo || companyBranding?.logo || "";
      const moduleIds =
        companyBranding?.modules?.map((module: any) => module?.id) ?? [];
      const categoryModuleIds =
        companyBranding?.categorySpecificModules?.map(
          (module: any) => module?.id
        ) ?? [];

      if (brandingRecordId) {
        await services.editCompanyBranding(
          brandingRecordId,
          companyData?.id,
          tenancyId,
          logoValue,
          brandingColor,
          values.companyName as string,
          moduleIds,
          categoryModuleIds
        );
      } else if (companyData?.id && tenancyId) {
        await services.createCompanyBranding(
          companyData?.id,
          tenancyId,
          logoValue,
          brandingColor,
          values.companyName as string,
          moduleIds,
          categoryModuleIds
        );
      }

      toast.success(
        `Company ${companyData?.company_name ?? companyData?.companyName} edited successfully`
      );
      await refetch();
      router.push(`/${tenancyId}/admin/company-profile`);
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
      setPhone(
        companyData?.primary_contact_phone_number ??
          companyData?.primaryContactPhoneNumber ??
          ""
      );

      if (companyBranding) {
        setColor(companyBranding?.color || "#1FA35C");
        setSmallLogoUrl(companyBranding?.logo || "");
      }

      setBackgroundImageUrl(
        companyData?.company_logo ?? companyData?.companyLogo ?? ""
      );
    }
  }, [companyData, companyBranding]);

  useEffect(() => {
    if (!companyData && !isLoading && companyId) {
      refetch();
    }
  }, [companyData, isLoading, companyId, refetch]);

  return (
    <div className="px-5 pb-20 pt-5">
      <div>
        {isLoading || (!companyId && !companyData) ? (
          <div className="h-[20rem] flex items-center justify-center">
            <div>
              <LoadingIcon />
              <p className="mt-2 text-xs text-gray-500">
                Fetching company details
              </p>
            </div>
          </div>
        ) : !companyData ? (
          <div className="py-16 text-center">
            <h3 className="text-lg font-semibold text-slate-900">
              Company profile unavailable
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              We could not load this company for editing. Go back and try again.
            </p>
            <button
              type="button"
              onClick={() => router.back()}
              className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm"
            >
              Go back
            </button>
          </div>
        ) : (
          <CompanyForm
            headerText={`Edit ${companyData?.company_name ?? companyData?.companyName ?? "Company"}`}
            logoPresentOnLoad={Boolean(
              companyData?.company_logo || companyData?.companyLogo
            )}
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
