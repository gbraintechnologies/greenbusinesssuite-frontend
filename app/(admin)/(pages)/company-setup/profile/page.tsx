"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { IoIosArrowBack, IoIosArrowDown } from "react-icons/io";

import services from "@/services";

import { Menu, Transition } from "@headlessui/react";

import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";

import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";

import Modal from "@/components/Modal/Modal";

import { Company, IFilter, TimelineType, TimelineValues } from "@/types";

import CompanyAdmins from "./_components/CompanyAdmins";

import { VscLink } from "react-icons/vsc";

import Configuration from "./_components/Configuration";
import BrandingSettings from "./_components/BrandingSettings";
import AssignedForms from "./_components/AssignedForms";

import SMSSenderID from "./_components/SMSSenderID";
import { TbPhotoCircle } from "react-icons/tb";

// @ts-ignore
import "./index.css";
import { Spinner, Tab } from "@heroui/react";
import GlobalTabs from "@/components/GlobalTabs/GlobalTabs";
import Profile from "../components/Profile";
import AssignForm from "../components/AssignForm";

const Page = () => {
  const [statuses, setStatuses] = useState([
    { id: 2, name: "Active", value: "ACTIVE" },
    { id: 3, name: "Inactive", value: "INACTIVE" },
  ]);

  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<IFilter[]>([
    { id: 0, name: "Description", value: "description" },
    { id: 1, name: "Administrators", value: "administrators" },
    { id: 2, name: "Assigned Forms", value: "assigned_forms" },
    { id: 3, name: "Branding Settings", value: "branding_settings" },
    { id: 4, name: "SMS Sender ID", value: "sms_sender_id" },
    { id: 5, name: "Configuration", value: "configuration" },
  ]);

  const [activeFilter, setActiveFilter] = useState<IFilter>(filters[0]);

  const [activeStatus, setActiveStatus] = useState({} as any);

  const [showAssignModal, setShowAssignModal] = useState<boolean>(false);

  const [parentAddressScheme, setParentAddressScheme] = useState<any>();

  const [companyLogo, setCompanyLogo] = useState<File | null>();

  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string>("");

  const [companySmallLogo, setCompanySmallLogo] = useState<File | null>();

  const [smallLogoUrl, setSmallLogoUrl] = useState<string>("");

  const [color, setColor] = useState<string>("#1d1d1d");

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

  const searchParams = useSearchParams();

  const id = searchParams.get("id");

  const { data: companyData, isLoading } = useQuery<Company>({
    queryKey: ["company", parseInt(id as string)],
    queryFn: services.getCompanyById(Number(id)),
  });

  const { data: companyBranding, isLoading: brandingLoading } = useQuery({
    queryKey: ["get company branding info", companyData?.companyIdentifier],
    queryFn: services.getCompanyBranding(companyData?.companyIdentifier!),
    enabled: !!companyData?.companyIdentifier,
    retry: 1,
  });

  const [formsLoading, setFormsLoading] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    if (!companyData) return;
    const status = statuses.find(
      (status) =>
        status.value.toLowerCase() === companyData?.status?.toLowerCase()
    );
    setActiveStatus(status);
    // setParentAddressScheme(
    //   country?.addressingScheme?.parentLevels?.find(
    //     (entry: any) => entry?.id == companyParentAddressId
    //   )
    // );
    setBackgroundImageUrl(companyData?.companyLogo);

    if (companyBranding) {
      setColor(companyBranding?.color);
      setSmallLogoUrl(companyBranding?.logo);
    }
  }, [companyData, companyBranding]);

  if (isLoading) {
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
          <div className="flex items-center gap-3">
            <div
              className="my-3 cursor-pointer flex text-sm items-center gap-2"
              onClick={() => router.back()}
            >
              <IoIosArrowBack size={16} />
            </div>
            <h3 className="font-semibold text-xl">Company Profile</h3>
          </div>
        </div>

        <div className="w-full mt-4 px-9 py-4 flex justify-between items-center bg-[#F8FAFC] h-48 rounded-xl">
          <div className="flex gap-5 items-center justify-center">
            {companyBranding?.logo ? (
              <img
                src={companyBranding?.logo ?? ""}
                width={144}
                height={144}
                className="rounded-full w-36 h-36 object-cover border border-[rgba(226, 232, 240, 1)]"
                alt="Company Logo"
              />
            ) : (
              <div className="rounded-full w-36 h-36 border bg-[rgba(226, 232, 240, 1)] flex items-center justify-center ">
                <TbPhotoCircle size={70} />
              </div>
            )}
            {companyData?.companyName && (
              <div className="flex flex-col gap-3">
                <div className="label">Company Name</div>
                <div className="text-4xl -mt-2 font-bold">
                  {companyData?.companyName}
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-6 items-center">
            <div className="flex flex-col gap-3">
              <div className="label">Company Dashboard</div>
              {companyData?.companyIdentifier &&
              companyData?.buildStatus?.toLowerCase() == "active" ? (
                <button
                  className=" border border-[rgba(226, 232, 240, 1)] text-sm bg-white flex items-center justify-center h-9 rounded-lg shadow-[0px_2px_8px_0px_rgba(100, 116, 139, 0.1)] gap-2"
                  onClick={() => {
                    const currentHost = window.location.origin;
                    const url =
                      currentHost + `/${companyData?.companyIdentifier}/auth`;

                    navigator.clipboard.writeText(url).then(() => {
                      toast.dismiss();
                      toast.success(
                        `${companyData?.companyName} dashboard link copied!`
                      );
                    });
                  }}
                >
                  <VscLink /> Copy Link{" "}
                </button>
              ) : (
                <div className="flex items-center text-xs text-gray-500 gap-2">
                  <Spinner color="default" size="sm" />
                  <p>Setting up...</p>
                </div>
              )}
            </div>
            {companyData?.status && (
              <div className="flex flex-col gap-3">
                <div className="label">Status</div>
                <Menu as={"div"} className={"z-20 relative inline-block"}>
                  <Menu.Button className=" border border-[rgba(226, 232, 240, 1)] text-sm bg-white flex items-center h-9 rounded-lg shadow-[0px_2px_8px_0px_rgba(100, 116, 139, 0.1)] gap-2 px-3">
                    {activeStatus?.name}
                    <div className="border-r-[0.3px] border-opacity-50 border-[rgba(226, 232, 240, 1)] h-9"></div>
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
                              className="flex hover:text-primary-dark w-24 hover:bg-gray-50 text-sm bg-white items-center h-9 rounded-lg px-3 py-2"
                              // onClick={() => editCompanyStatus(status)}
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
          <GlobalTabs defaultTab="assignedForms">
            <Tab key="assignedForms" title="Assigned Forms">
              <AssignedForms
                // assignedForms={assignedForms}
                assignedForms={{ content: [] }}
                selectedTimeline={selectedTimeline}
                setSelectedTimeline={setSelectedTimeline}
                page={page}
                setPage={setPage}
                limit={limit}
                setShowAssignModal={setShowAssignModal}
                formsLoading={formsLoading}
              />
            </Tab>
            <Tab key="branding" title="Branding">
              <BrandingSettings
                color={color}
                setCompanySmallLogo={setCompanySmallLogo}
                companySmallLogo={companySmallLogo}
                smallLogoUrl={smallLogoUrl}
                showColorPicker={showColorPicker}
                setShowColorPicker={setShowColorPicker}
                handleChangeComplete={handleChangeComplete}
                brandingLoading={brandingLoading}
                companyBranding={companyBranding}
                companyData={companyData}
              />
            </Tab>
            <Tab key="admins" title="Administrators">
              <CompanyAdmins companyId={id} />
            </Tab>
            <Tab key="senderId" title="Sender ID">
              <SMSSenderID company={companyData} companyId={id} />
            </Tab>
            <Tab key="configuration" title="Configuration">
              <Configuration tenantId={companyData?.companyIdentifier!} />
            </Tab>
            <Tab key="companyProfile" title="Company Profile">
              <Profile companyData={companyData} isLoading={isLoading} />
            </Tab>
          </GlobalTabs>
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
          companyId={companyData?.id ? companyData?.id : null}
          setShow={setShowAssignModal}
          queryClient={queryClient}
        />
      </Modal>
    </>
  );
};

export default Page;
