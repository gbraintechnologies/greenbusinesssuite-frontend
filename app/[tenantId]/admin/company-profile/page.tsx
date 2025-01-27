"use client";

import { useQuery } from "@tanstack/react-query";
import "./index.css";
import UpdateInfo from "@/public/svg/updateInfo.svg";
import Image from "next/image";

import Tabs from "@/components/Tabs/Tabs";
import services from "@/services";

import Link from "next/link";
import { useEffect, useState, use } from "react";
import { toast } from "sonner";
import UserIcon from "@/public/icons/UserIcon";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import { IFilter, TimelineType, TimelineValues } from "@/types";

import { SketchPicker } from "react-color";

import WriteIcon from "@/public/icons/WriteIcon";
import { RiDeleteBin6Line } from "react-icons/ri";
import CloudUploadIcon from "@/public/icons/CloudUploadIcon";

import useFileUpload from "@/hooks/useFileUpload";
import { VscLink } from "react-icons/vsc";
import useCompany from "@/hooks/useCompany";
import useAdmin from "@/hooks/useAdmin";
import { PermissionTypes } from "@/types/permissionTypes";
import Configuration from "./components/Configuration";
import SMSSenderID from "@/app/(admin)/(pages)/company-setup/profile/_components/SMSSenderID";

const Page = (props: any) => {
  const params: any = use(props.params);
  const tenant_id = params.tenantId;

  const { companyBranding, setCompanyBranding } = useCompany();

  console.log(" ompan", companyBranding);

  const statuses = [
    { id: 2, name: "Active", value: "ACTIVE" },
    { id: 3, name: "Inactive", value: "INACTIVE" },
  ];

  const [filters, setFilters] = useState<IFilter[]>([
    { id: 1, name: "Description", value: "description" },
    { id: 2, name: "Branding Settings", value: "branding_settings" },
    { id: 3, name: "SMS Sender ID", value: "sms_sender_id" },
    // { id: 3, name: "Configuration", value: "configuration" },
  ]);

  const [activeFilter, setActiveFilter] = useState<IFilter>({
    id: 1,
    name: "Description",
    value: "description",
  });

  const [activeStatus, setActiveStatus] = useState({} as any);

  const [showAssignModal, setShowAssignModal] = useState<boolean>(false);

  const [parentAddressScheme, setParentAddressScheme] = useState<any>();

  const [companyLogo, setCompanyLogo] = useState<File | null>();

  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string>("");

  const [companySmallLogo, setCompanySmallLogo] = useState<File | null>();

  const [smallLogoUrl, setSmallLogoUrl] = useState<string>("");

  const [color, setColor] = useState<string>("");

  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);

  const { checkPermission } = useAdmin();

  //pagination
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(12);

  //timeline
  const [selectedTimeline, setSelectedTimeline] = useState<
    { label: TimelineValues; value: TimelineType } | undefined
  >();

  const handleChangeComplete = (newColor: any) => {
    setColor(newColor.hex);
  };

  useEffect(() => {
    if (companySmallLogo) {
      const smallUrl = URL.createObjectURL(companySmallLogo);
      setSmallLogoUrl(smallUrl);

      return () => URL.revokeObjectURL(smallUrl);
    }
  }, [companySmallLogo]);

  const { data: companyData, isLoading } = useQuery({
    queryKey: ["company", parseInt(companyBranding?.companyId)],
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
  //   queryFn: services.getJurisdictionEntriesById(companyData?.company_address),
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

  const { handleFileUpload } = useFileUpload();

  useEffect(() => {
    if (!companyData) return;
    const status = statuses.find(
      (status) =>
        status.value.toLowerCase() === companyData?.status?.toLowerCase()
    );
    setActiveStatus(status);
    // setParentAddressScheme(
    //   country?.parentAddressScheme?.entries?.find(
    //     (entry: any) => entry?.id == companyParentAddressId
    //   )
    // );
    setBackgroundImageUrl(companyData?.company_logo);

    if (companyBranding) {
      setColor(companyBranding?.color);
      setSmallLogoUrl(companyBranding?.logo);
    }
  }, [companyData, companyBranding]);

  const editCompanyBranding = async () => {
    if (!smallLogoUrl) {
      toast.error("Logo is required");
      return;
    }
    try {
      const companySmallLogoURL =
        companySmallLogo && (await handleFileUpload(companySmallLogo as File));

      await services.editCompanyBranding(
        companyBranding?.id,
        companyData?.id,
        companyData?.company_identifier,
        companySmallLogo
          ? companySmallLogoURL?.file_url
          : companyBranding?.logo,
        color,
        companyData?.company_name,
        companyBranding?.modules?.map((module: any) => module?.id),
        companyBranding?.categorySpecificModules?.map(
          (module: any) => module?.id
        )
      );
      toast.success("Company branding updated successfully");
    } catch (error) {
      toast.error("Failed to update company branding");
    }
  };
  if (isLoading) {
    // if (isLoading || areFormsLoading || isCountryLoading) {
    return (
      <div className="h-[20rem] flex items-center justify-center">
        <div>
          <LoadingIcon />
          <p className="mt-2 text-xs text-gray-500">Fetching company details</p>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="px-5 py-5 pb-5">
        {/* HEADER */}
        <div className="w-full text-primary-dark  flex justify-between items-center">
          <h3 className="font-semibold text-xl">Company Profile</h3>

          {checkPermission(PermissionTypes.EDIT_COMPANY) && (
            <div className="flex gap-3">
              <Link
                href={`/${tenant_id}/admin/company-profile/edit`}
                style={{ backgroundColor: companyBranding?.color }}
                className="disabled:bg-gray-400 py-3 flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
              >
                <Image src={UpdateInfo} alt="Update Info" />
                Update Information
              </Link>
            </div>
          )}
        </div>

        <div className="w-full mt-4 px-9 py-4 flex justify-between items-center bg-[#F8FAFC] h-48 rounded-xl">
          <div className="flex gap-5 items-center justify-center">
            {companyData?.company_logo ? (
              <Image
                src={companyData?.company_logo}
                width={144}
                height={144}
                className="rounded-full w-36 h-36 object-cover border border-[rgba(226, 232, 240, 1)]"
                alt="Company Logo"
              />
            ) : (
              <div className="rounded-full w-36 h-36 border bg-[rgba(226, 232, 240, 1)] flex items-center justify-center ">
                <UserIcon width="50" height="50" />
              </div>
            )}
            {companyData?.company_name && (
              <div className="flex flex-col gap-3">
                <div className="label">Company Name</div>
                <div className="header">{companyData?.company_name}</div>
              </div>
            )}
          </div>
          <div className="flex gap-6 items-center">
            {companyData?.company_identifier && (
              <div className="flex flex-col gap-3">
                <div className="label">Company Dashboard</div>

                <button
                  className=" border border-[rgba(226, 232, 240, 1)] text-sm bg-white flex items-center justify-center h-9 rounded-lg shadow-[0px_2px_8px_0px_rgba(100, 116, 139, 0.1)] gap-2"
                  onClick={() => {
                    const currentHost = window.location.origin;
                    const url =
                      currentHost +
                      `/${companyData?.company_identifier}/auth/login`;

                    navigator.clipboard.writeText(url).then(() => {
                      toast.dismiss();
                      toast.success(
                        `${companyData?.company_name} dashboard link copied!`
                      );
                    });
                  }}
                >
                  <VscLink /> Copy Link{" "}
                </button>
              </div>
            )}
            {companyData?.status && (
              <div className="flex flex-col gap-3">
                <div className="label">Status</div>
                <div className={"z-20 relative inline-block"}>
                  <button className=" border border-[rgba(226, 232, 240, 1)] text-sm bg-white flex items-center h-9 rounded-lg shadow-[0px_2px_8px_0px_rgba(100, 116, 139, 0.1)] gap-2 px-3">
                    {activeStatus?.name}
                    {/* <div className="border-r-[0.3px] border-opacity-50 border-[rgba(226, 232, 240, 1)] h-10"></div>
                    <IoIosArrowDown /> */}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* TABS FOR DESCRIPTION  / ASSIGNED FORMS */}
        <div className="mt-10">
          <div className="flex justify-center items-center">
            <Tabs
              filters={filters}
              setActiveFilter={setActiveFilter}
              activeFilter={activeFilter}
            />
          </div>

          {/* RENDERING BASED ON FITER */}
          <div>
            {activeFilter.value === "description" && (
              <>
                <div className="flex-1 py-5 pb-3">
                  {companyDescription && (
                    <div className="group-item">
                      <div className="label">Company description</div>
                      <div className="value">{companyDescription}</div>
                    </div>
                  )}

                  {companyData?.primary_contact_name && (
                    <div className="group-item">
                      <div className="label">Contact person</div>
                      <div className="value">
                        {companyData?.primary_contact_name}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between">
                    {companyData?.primary_contact_phone_number && (
                      <div className="group-item">
                        <div className="label">Phone Number</div>
                        <div className="value">
                          {companyData?.primary_contact_phone_number}
                        </div>
                      </div>
                    )}
                    {companyData?.primary_contact_email && (
                      <div className="group-item">
                        <div className="label">Email</div>
                        <div className="value">
                          {companyData?.primary_contact_email}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {activeFilter?.value == "branding_settings" && (
              <div className=" pt-6">
                <header className="pb-3 flex justify-between items-center w-full">
                  <div>
                    <h3 className="text-lg text-primary-dark font-semibold">
                      Branding Settings
                    </h3>
                    <p className="text-sm text-[#667085]">
                      Set your default branding elements to determine how the
                      interface appears to customers.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="bg-white disabled:bg-gray-400 py-3 text-black border w-24 flex items-center justify-center border-[rgba(226, 232, 240, 1)] text-sm hover:opacity-95 items-center gap-2 rounded-xl"
                    onClick={editCompanyBranding}
                  >
                    Save
                  </button>
                </header>
                <div className="max-w-2xl">
                  {/* COMPANY SMALL LOGO */}
                  <div className="mt-2 mb-4">
                    <h2 className="text-base text-primary-dark font-medium">
                      Upload small icon
                    </h2>
                    <p className="text-sm text-[#667085]">
                      A smaller representation of your logo to be used as
                      favicon. It must be squared and at at least 128px by 128px
                      with a max size of 512KB. Supported formats are JPG and
                      PNG only.
                    </p>
                    {!(companySmallLogo || smallLogoUrl) && (
                      <label className=" mt-2 flex gap-2 items-center my-2  bg-white w-fit h-fit border p-2 rounded-md text-[#334155] font-medium border-[#E2E8F0] text-sm cursor-pointer ">
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            setCompanySmallLogo(
                              e.target.files && e.target.files[0]
                            );
                          }}
                          accept=".jpg, .png"
                        />
                        <CloudUploadIcon /> <p>Upload</p>
                      </label>
                    )}
                    {smallLogoUrl && (
                      <div
                        className="w-32 h-32 rounded-md my-3"
                        style={{
                          backgroundImage: Boolean(smallLogoUrl)
                            ? `url(${smallLogoUrl})`
                            : "",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          border: "1px solid #E2E8F0",
                          position: "relative",
                        }}
                      >
                        <div className="absolute bottom-3 right-[-2.1rem] border border-[#E2E8F0] rounded-md bg-white flex items-center">
                          <div
                            className="border-r border-[#E2E8F0] flex justify-center items-center w-8 py-2 cursor-pointer"
                            onClick={() => {
                              setCompanySmallLogo(null);
                              setSmallLogoUrl("");
                            }}
                          >
                            <RiDeleteBin6Line color="#0E121B" />
                          </div>
                          <label className="flex justify-center items-center w-8 py-2 relative cursor-pointer">
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => {
                                setCompanySmallLogo(
                                  e.target.files && e.target.files[0]
                                );
                              }}
                              accept=".jpg, .png"
                            />
                            <WriteIcon />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* COMPANY COLOR */}
                  <div className="input-holder">
                    <h2 className="text-base text-primary-dark font-medium">
                      Company Color
                    </h2>
                    <p className="text-sm text-[#667085]">
                      Add a splash of colour to your pages
                    </p>
                    {!color && (
                      <button
                        className=" mt-2 flex gap-2 items-center my-2  bg-white w-fit h-fit border py-2 px-4 rounded-md text-[#334155] font-medium border-[#E2E8F0] text-sm cursor-pointer "
                        type="button"
                        onClick={() => setShowColorPicker(!showColorPicker)}
                      >
                        Select
                      </button>
                    )}
                    {color && (
                      <button
                        className=" mt-2 flex items-center my-2  bg-white w-fit h-8 border rounded-md text-[#334155] font-medium border-[#E2E8F0] text-sm cursor-pointer "
                        type="button"
                        onClick={() => setShowColorPicker(!showColorPicker)}
                      >
                        <div
                          className={`w-5 h-8 rounded-tl-md rounded-bl-md`}
                          style={{ backgroundColor: color }}
                        ></div>
                        <p className="p-2">{color}</p>
                      </button>
                    )}
                    {showColorPicker && (
                      <SketchPicker
                        color={color}
                        onChangeComplete={handleChangeComplete}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeFilter?.value === "sms_sender_id" && (
              <SMSSenderID
                company={companyData}
                companyId={companyBranding?.id}
              />
            )}

            {/* {activeFilter?.value === "configuration" && (
              <Configuration tenantId={companyData?.company_identifier} />
            )} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
