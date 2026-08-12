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

import { CompanyType, IFilter, TimelineType, TimelineValues } from "@/types";

import CompanyAdmins from "./_components/CompanyAdmins";

import { VscLink } from "react-icons/vsc";

import Configuration from "./_components/Configuration";
import BrandingSettings from "./_components/BrandingSettings";
import AssignedForms from "./_components/AssignedForms";

import SMSSenderID from "./_components/SMSSenderID";
import CompanyBrandAvatar from "@/components/CompanyBrand/CompanyBrandAvatar";

// @ts-ignore
import "./index.css";
import { Spinner, Tab } from "@heroui/react";
import GlobalTabs from "@/components/GlobalTabs/GlobalTabs";
import Profile from "../components/Profile";
import AssignForm from "../components/AssignForm";

const Page = () => {
  const [statuses] = useState([
    { id: 2, name: "Active", value: "ACTIVE" },
    { id: 3, name: "Inactive", value: "INACTIVE" },
    { id: 4, name: "Suspended", value: "SUSPENDED" },
  ]);
  const [statusUpdating, setStatusUpdating] = useState(false);

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

  const searchParams = useSearchParams();

  const id = searchParams.get("id");

  const { data: companyData, isLoading } = useQuery<CompanyType>({
    queryKey: ["company", parseInt(id as string)],
    queryFn: services.getCompanyById(Number(id)),
    enabled: Boolean(id) && !Number.isNaN(Number(id)),
    retry: false,
  });

  const { data: assignedForms, isLoading: assignedFormsLoading } =
    useQuery<CompanyType>({
      queryKey: ["company assigned forms", parseInt(id as string)],
      queryFn: services.getCompanyAssignedForms(Number(id)),
      enabled: Boolean(id) && !Number.isNaN(Number(id)),
      retry: false,
    });

  const tenancyId =
    companyData?.companyIdentifier ?? companyData?.company_identifier;

  const { data: companyBranding, isLoading: brandingLoading } = useQuery({
    queryKey: ["get company branding info", tenancyId],
    queryFn: services.getCompanyBranding(tenancyId!),
    enabled: !!tenancyId,
    retry: false,
  });

  const [formsLoading, setFormsLoading] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    if (!companyData) return;
    const status = statuses.find(
      (status) =>
        status.value.toLowerCase() === companyData?.status?.toLowerCase()
    );
    setActiveStatus(status ?? statuses[0]);
    setBackgroundImageUrl(companyData?.companyLogo);

    if (companyBranding) {
      setColor(companyBranding?.color || "#1d1d1d");
      setSmallLogoUrl(companyBranding?.logo || "");
    }
  }, [companyData, companyBranding, statuses]);

  const updateCompanyStatus = async (status: {
    id: number;
    name: string;
    value: string;
  }) => {
    if (!companyData?.id || statusUpdating) return;
    if (status.value === activeStatus?.value) return;

    setStatusUpdating(true);
    toast.info(`Updating status to ${status.name}...`);

    try {
      await services.updateCompanyStatus({
        id: Number(companyData.id),
        status: status.value,
      });
      setActiveStatus(status);
      toast.dismiss();
      toast.success(`Company marked as ${status.name}`);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["company", parseInt(id as string)],
        }),
        queryClient.invalidateQueries({ queryKey: ["companies"] }),
        queryClient.invalidateQueries({ queryKey: ["all companies"] }),
      ]);
    } catch (error: any) {
      toast.dismiss();
      toast.error(
        error?.response?.data?.message ??
          error?.response?.data ??
          "Failed to update company status"
      );
      console.error("Error updating company status", error);
    } finally {
      setStatusUpdating(false);
    }
  };

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
      <div className="px-3 pb-10 sm:px-5">
        {/* HEADER */}
        <div className="flex w-full items-center justify-between text-primary-dark">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="my-3 flex shrink-0 cursor-pointer items-center gap-2 rounded-lg p-1 text-sm hover:bg-slate-100"
              onClick={() => router.back()}
              aria-label="Go back"
            >
              <IoIosArrowBack size={18} />
            </button>
            <h3 className="truncate text-lg font-semibold sm:text-xl">
              Company Profile
            </h3>
          </div>
        </div>

        {/* COMPANY HERO */}
        <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:mt-4 sm:bg-[#F8FAFC] sm:p-6 md:px-9 md:py-5">
          <div className="flex flex-col items-center gap-4 text-center md:flex-row md:items-center md:justify-between md:text-left">
            <div className="flex min-w-0 flex-col items-center gap-3 md:flex-row md:gap-5">
              <div className="md:hidden">
                <CompanyBrandAvatar
                  logoUrl={companyBranding?.logo ?? companyData?.companyLogo}
                  name={companyData?.companyName}
                  size="lg"
                  shape="circle"
                />
              </div>
              <div className="hidden md:block">
                <CompanyBrandAvatar
                  logoUrl={companyBranding?.logo ?? companyData?.companyLogo}
                  name={companyData?.companyName}
                  size="xl"
                  shape="circle"
                />
              </div>
              {companyData?.companyName && (
                <div className="min-w-0 max-w-full">
                  <div className="label">Company Name</div>
                  <h2 className="mt-1 break-words text-xl font-bold leading-tight text-slate-900 sm:text-2xl md:text-4xl">
                    {companyData?.companyName}
                  </h2>
                  {companyData?.companyIdentifier && (
                    <p className="mt-1 truncate text-xs text-slate-400">
                      {companyData.companyIdentifier}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex w-full shrink-0 flex-col gap-4 md:w-auto md:flex-row md:items-end">
              <div>
                <div className="label mb-2 md:text-left">Status</div>
                <Menu as="div" className="relative z-20 inline-block w-full md:w-auto">
                  <Menu.Button
                    disabled={statusUpdating}
                    className="flex h-10 w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm disabled:opacity-70 md:h-9 md:w-auto md:rounded-lg"
                  >
                    {statusUpdating ? "Updating..." : activeStatus?.name || "Set status"}
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
                    <Menu.Items className="absolute right-0 z-50 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                      {statuses
                        .filter((status) => status.id !== activeStatus?.id)
                        .map((status) => (
                          <Menu.Item key={status.id}>
                            <button
                              type="button"
                              className="flex h-9 w-36 items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                              onClick={() => updateCompanyStatus(status)}
                            >
                              {status.name}
                            </button>
                          </Menu.Item>
                        ))}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>

              <div>
                <div className="label mb-2 md:text-left">Company Dashboard</div>
                {companyData?.companyIdentifier &&
                companyData?.buildStatus?.toLowerCase() == "active" ? (
                  <button
                    type="button"
                    className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 md:h-9 md:w-auto md:rounded-lg md:px-4"
                    onClick={() => {
                      const currentHost = window.location.origin;
                      const companyName = encodeURIComponent(
                        companyData?.companyName || ""
                      );
                      const url =
                        currentHost +
                        `/${companyData?.companyIdentifier}/auth?c=${companyName}`;

                      navigator.clipboard.writeText(url).then(() => {
                        toast.dismiss();
                        toast.success(
                          `${companyData?.companyName} dashboard link copied!`
                        );
                      });
                    }}
                  >
                    <VscLink /> Copy Link
                  </button>
                ) : (
                  <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-gray-500 md:justify-start md:border-0 md:bg-transparent md:px-0 md:py-0">
                    <Spinner color="default" size="sm" />
                    <p>Setting up...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* TABS FOR DESCRIPTION  / ASSIGNED FORMS */}
        <div className="mt-6 sm:mt-10">
          <GlobalTabs defaultTab="assignedForms">
            <Tab key="assignedForms" title="Assigned Forms">
              <AssignedForms
                assignedForms={assignedForms}
                companyData={companyData}
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
                setSmallLogoUrl={setSmallLogoUrl}
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
