"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import "./index.css";
import UpdateInfo from "@/public/svg/updateInfo.svg";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { IoIosArrowDown } from "react-icons/io";
import Tabs from "@/components/Tabs/Tabs";
import services from "@/services";

import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";
import UserIcon from "@/public/icons/UserIcon";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import { LuPlusCircle } from "react-icons/lu";

import FormCard from "@/components/Form/FormCard";
import AssignForm from "../components/AssignForm";
import Modal from "@/components/Modal/Modal";

import { IFilter, TimelineType, TimelineValues } from "@/types";
import EmptyList from "@/components/Form/EmptyList";
import { isConvertibleToNumber } from "@/utils/IsNumber/IsNumber";
import { SketchPicker } from "react-color";
import UploadIcon from "@/public/icons/UploadIcon";
import WriteIcon from "@/public/icons/WriteIcon";
import { RiDeleteBin6Line } from "react-icons/ri";
import CloudUploadIcon from "@/public/icons/CloudUploadIcon";
import CompanyAdmins from "./_components/CompanyAdmins";
import DatePicker from "@/components/DatePicker/DatePicker";
import Pagination from "@/components/Pagination/Pagination";
import useFileUpload from "@/hooks/useFileUpload";
import { VscLink } from "react-icons/vsc";
import Loader from "@/components/Loader/Loader";

const Page = () => {
  const [statuses, setStatuses] = useState([
    { id: 2, name: "Active", value: "ACTIVE" },
    { id: 3, name: "Inactive", value: "INACTIVE" },
  ]);

  const [filters, setFilters] = useState<IFilter[]>([
    { id: 1, name: "Description", value: "description" },
    { id: 5, name: "Administrators", value: "administrators" },
    { id: 2, name: "Assigned Forms", value: "assigned_forms" },
    { id: 3, name: "Branding Settings", value: "branding_settings" },
  ]);

  const [activeFilter, setActiveFilter] = useState<IFilter>({
    id: 3,
    name: "Branding Settings",
    value: "branding_settings",
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

  const logoPresentOnLoad = true;

  const searchParams = useSearchParams();

  const id = searchParams.get("id");

  const { data: companyData, isLoading } = useQuery({
    queryKey: ["company", parseInt(id as string)],
    queryFn: services.getCompanyById(Number(id)),
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

  const {
    data: assignedForms,
    isLoading: areFormsLoading,
    refetch,
  } = useQuery({
    queryKey: ["get assigned forms for ", Number(companyData?.id)],
    queryFn: services.getFormsByCompanyId(
      companyData?.id,
      page,
      limit,
      selectedTimeline?.value
    ),
    enabled: !!companyData?.id,
  });

  const { data: country, isLoading: isCountryLoading } = useQuery({
    queryKey: ["country", companyData?.company_address],
    queryFn: () => services.getCountryInfoByName(companyData?.company_address),
    enabled: !!companyData?.company_address,
  });

  const { data: industry, isLoading: isIndustryLoading } = useQuery({
    queryKey: ["industry", companyData?.industry],
    queryFn: services.getSubSectorByID(
      Number(companySectorId),
      Number(companyData?.industry)
    ),
    enabled:
      !!companyData?.industry &&
      !!companySectorId &&
      isConvertibleToNumber(companyData?.industry),
  });

  const { data: companyBranding, isLoading: brandingLoading } = useQuery({
    queryKey: ["get company branding info", companyData?.company_identifier],
    queryFn: services.getCompanyBranding(companyData?.company_identifier),
    enabled: !!companyData?.company_identifier,
  });

  const [formsLoading, setFormsLoading] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const { handleFileUpload } = useFileUpload();

  useEffect(() => {
    const refetchForms = async () => {
      try {
        setFormsLoading(true);
        refetch();
      } catch (error) {
        toast.error("An error occurred");
      } finally {
        setFormsLoading(false);
      }
    };

    refetchForms();
  }, [page, selectedTimeline]);

  useEffect(() => {
    if (!companyData) return;
    const status = statuses.find(
      (status) =>
        status.value.toLowerCase() === companyData?.status?.toLowerCase()
    );
    setActiveStatus(status);
    setParentAddressScheme(
      country?.addressingScheme?.parentLevels?.find(
        (entry: any) => entry?.id == companyParentAddressId
      )
    );
    setBackgroundImageUrl(companyData?.company_logo);

    if (companyBranding) {
      setColor(companyBranding?.color);
      setSmallLogoUrl(companyBranding?.logo);
    }
  }, [companyData, country, companyBranding]);

  const editCompanyStatus = async (status: any) => {
    let companyDataInfo = { ...companyData, status: status.value };

    const keyToDelete = "company_custom_values";

    let customFields = companyDataInfo[keyToDelete];

    delete companyDataInfo[keyToDelete];

    try {
      await services.editCompanyWithCustomFields(
        companyData.id,
        companyDataInfo,
        customFields
      );
      setActiveStatus(status);
      toast.success("Company status updated successfully");
    } catch (error) {
      toast.error("Failed to update company status");
    }
  };

  const editCompanyBranding = async () => {
    if (!smallLogoUrl) {
      toast.error("Logo is required");
      return;
    }
    try {
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
      <div className="px-5 pb-10">
        {/* HEADER */}
        <div className="w-full text-primary-dark  flex justify-between items-center">
          <h3 className="font-semibold text-xl">Company Profile</h3>

          {/* <div className="flex gap-3">
            <Link
              href={`/company-setup/profile/edit?id=${id}`}
              className="bg-primary-green disabled:bg-gray-400 py-3 flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
            >
              <Image src={UpdateInfo} alt="Update Info" />
              Update Information
            </Link>
          </div> */}
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
                      currentHost + `/${companyData?.company_identifier}/auth`;

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
                <Menu as={"div"} className={"z-20 relative inline-block"}>
                  <Menu.Button className=" border border-[rgba(226, 232, 240, 1)] text-sm bg-white flex items-center h-9 rounded-lg shadow-[0px_2px_8px_0px_rgba(100, 116, 139, 0.1)] gap-2 px-3">
                    {activeStatus?.name}
                    <div className="border-r-[0.3px] border-opacity-50 border-[rgba(226, 232, 240, 1)] h-10"></div>
                    <IoIosArrowDown />
                  </Menu.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="z-50 absolute right-0 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-[0px_2px_8px_0px_rgba(100, 116, 139, 0.1)] ring-1 ring-black/5 focus:outline-none">
                      {statuses
                        .filter((status) => status.id !== activeStatus?.id)
                        .map((status) => (
                          <Menu.Item key={status.id}>
                            <button
                              className="flex hover:text-primary-dark w-24 hover:bg-gray-50 border border-[rgba(226, 232, 240, 1)] text-sm bg-white flex items-center h-9 rounded-lg px-3 py-2"
                              onClick={() => editCompanyStatus(status)}
                            >
                              {status.name}
                            </button>
                          </Menu.Item>
                        ))}
                    </Menu.Items>
                  </Transition>
                </Menu>
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

          {/* RENDERING BASED ON FILTER */}
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
                  {companyData?.company_address && (
                    <div className="group-item">
                      <div className="label">Jurisdiction</div>
                      <div className="value">
                        {country?.countryName}
                        {","}
                        {parentAddressScheme?.parentName}
                        {","}
                        {parentAddressScheme?.childLevels?.find(
                          (entry: any) => entry == companyChildAddressId
                        )}
                      </div>
                    </div>
                  )}
                  {companyData?.industry && (
                    <div className="group-item">
                      <div className="label">Industry</div>
                      <div className="value">
                        {isConvertibleToNumber(companyData?.industry)
                          ? industry?.sector?.parentSector
                          : companyData?.industry}
                        {","}
                        {companySubSector}
                      </div>
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

            {activeFilter.value === "assigned_forms" && (
              <>
                <div className="min-h-[40vh]">
                  <div className="flex items-center justify-between mb-2 mt-2">
                    <div className=" w-full text-[#475569] font-medium my-4 text-base">
                      Assigned Forms
                    </div>
                    {/* ASSIGN NEW FORM */}
                    <button
                      className=" bg-white border border-[rgba(226, 232, 240, 1)] flex max-w-64 text-sm px-4 py-2 hover:opacity-95 items-center justify-center gap-2 rounded-lg w-full "
                      onClick={() => setShowAssignModal(true)}
                    >
                      <LuPlusCircle /> Assign New Form
                    </button>
                  </div>

                  {/* PAGINATION AND TIMELINE FILTER*/}
                  <div className="flex justify-between mb-3">
                    <DatePicker
                      selectedTimeline={selectedTimeline}
                      setSelectedTimeline={setSelectedTimeline}
                    />
                    <Pagination
                      limit={limit}
                      variant="no-text"
                      page={page}
                      currentData={assignedForms?.content}
                      setPage={setPage}
                    />
                  </div>

                  {/* LOADING FORMS */}
                  {formsLoading && <Loader text="Fetching forms" />}
                  {/* NO ASSIGNED FORM */}
                  {assignedForms?.content?.length === 0 && (
                    <div className="flex items-center justify-center py-5 w-full ">
                      <EmptyList text="No forms assigned to company" />
                    </div>
                  )}

                  {/**DISPLAYING ASSIGNED FORMS*/}
                  {assignedForms && assignedForms?.content?.length > 0 && (
                    <>
                      <div className="grid grid-cols-4 gap-10 ">
                        {assignedForms &&
                          assignedForms?.content?.map((form: any) => {
                            return (
                              <FormCard
                                key={form.id}
                                form={form}
                                noMetaData={true}
                              />
                            );
                          })}
                      </div>
                    </>
                  )}
                </div>
              </>
            )}

            {activeFilter.value === "branding_settings" && (
              <>
                {brandingLoading ? (
                  <Loader text="Fetching company branding information" />
                ) : (
                  <div className="pt-6">
                    <header className="pb-3 flex justify-between items-center w-full">
                      <div>
                        <h3 className="text-lg text-primary-dark font-semibold">
                          Branding Settings
                        </h3>
                        <p className="text-sm text-[#667085]">
                          Set your default branding elements to determine how
                          the interface appears to customers.
                        </p>
                      </div>
                      {/* <button
                    type="button"
                    className="bg-white disabled:bg-gray-400 py-3 text-black border w-24 flex items-center justify-center border-[rgba(226, 232, 240, 1)] text-sm hover:opacity-95 items-center gap-2 rounded-xl"
                    onClick={editCompanyBranding}
                  >
                    Save
                  </button> */}
                    </header>

                    <div className="max-w-2xl">
                      {/* COMPANY SMALL LOGO */}
                      <div className="mt-2 mb-4">
                        <h2 className="text-base text-primary-dark font-medium">
                          Upload small icon
                        </h2>
                        <p className="text-sm text-[#667085]">
                          A smaller representation of your logo to be used as a
                          favicon. It must be squared and at least 128px by
                          128px with a max size of 512KB. Supported formats are
                          JPG and PNG only.
                        </p>

                        {!companySmallLogo && !smallLogoUrl && (
                          <label className="mt-2 flex gap-2 items-center my-2 bg-white w-fit h-fit border p-2 rounded-md text-[#334155] font-medium border-[#E2E8F0] text-sm cursor-pointer">
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
                            <CloudUploadIcon />
                            <p>Upload</p>
                          </label>
                        )}

                        {smallLogoUrl && (
                          <div
                            className="w-32 h-32 rounded-md my-3"
                            style={{
                              backgroundImage: `url(${smallLogoUrl})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              border: "1px solid #E2E8F0",
                              position: "relative",
                            }}
                          >
                            {/* <div className="absolute bottom-3 right-[-2.1rem] border border-[#E2E8F0] rounded-md bg-white flex items-center">
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
                        </div> */}{" "}
                          </div>
                        )}
                      </div>

                      {/* COMPANY COLOR */}
                      <div className="input-holder">
                        <h2 className="text-base text-primary-dark font-medium">
                          Company Color
                        </h2>
                        <p className="text-sm text-[#667085]">
                          Add a splash of color to your pages
                        </p>

                        {!color && (
                          <button
                            className="mt-2 flex gap-2 items-center my-2 bg-white w-fit h-fit border py-2 px-4 rounded-md text-[#334155] font-medium border-[#E2E8F0] text-sm cursor-pointer"
                            type="button"
                            onClick={() => setShowColorPicker(!showColorPicker)}
                          >
                            Select
                          </button>
                        )}

                        {color && (
                          <button
                            className="mt-2 flex items-center my-2 bg-white w-fit h-8 border rounded-md text-[#334155] font-medium border-[#E2E8F0] text-sm cursor-pointer"
                            type="button"
                            onClick={() => setShowColorPicker(!showColorPicker)}
                          >
                            <div
                              className="w-5 h-8 rounded-tl-md rounded-bl-md"
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
              </>
            )}

            {activeFilter.value === "administrators" && (
              <CompanyAdmins companyId={id} />
            )}
          </div>
        </div>
      </div>
      {/**ASSIGN FORM MODAL */}
      <Modal
        isOpen={showAssignModal}
        setIsOpen={setShowAssignModal}
        size="big"
        title="Select form to assign to organisation"
      >
        <AssignForm
          companyId={companyData?.id}
          setShow={setShowAssignModal}
          queryClient={queryClient}
        />
      </Modal>
    </>
  );
};

export default Page;
