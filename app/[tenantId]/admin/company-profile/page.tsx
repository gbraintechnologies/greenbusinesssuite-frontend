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
import { IFilter } from "@/types";

import { VscLink } from "react-icons/vsc";
import useCompany from "@/hooks/useCompany";
import Configuration from "./components/Configuration";
import SMSSenderID from "@/app/(admin)/(pages)/company-setup/profile/_components/SMSSenderID";
import BrandingSettings from "@/app/(admin)/(pages)/company-setup/profile/_components/BrandingSettings";

function pickCustomValue(company: any, itemId: number) {
  const values =
    company?.company_custom_values ?? company?.companyCustomValues ?? [];
  return (
    values.find((field: any) => field.custom_profile_item_id == itemId)
      ?.value ?? ""
  );
}

const Page = (props: any) => {
  const params: any = use(props.params);
  const tenant_id = params.tenantId;

  const { companyBranding, setCompanyBranding } = useCompany();

  const [filters] = useState<IFilter[]>([
    { id: 1, name: "Description", value: "description" },
    { id: 2, name: "Branding Settings", value: "branding_settings" },
    { id: 3, name: "SMS Sender ID", value: "sms_sender_id" },
    { id: 4, name: "Configuration", value: "configuration" },
  ]);

  const [activeFilter, setActiveFilter] = useState<IFilter>(filters[0]);
  const [activeStatus, setActiveStatus] = useState({} as any);

  const [companySmallLogo, setCompanySmallLogo] = useState<File | null>();
  const [smallLogoUrl, setSmallLogoUrl] = useState<string>("");
  const [color, setColor] = useState<string>("#1FA35C");
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);

  const brandingCompanyId =
    companyBranding?.companyId ?? companyBranding?.company_id ?? null;

  const validBrandingCompanyId =
    brandingCompanyId != null &&
    String(brandingCompanyId).trim() !== "" &&
    String(brandingCompanyId).toLowerCase() !== "null" &&
    !Number.isNaN(Number(brandingCompanyId))
      ? Number(brandingCompanyId)
      : null;

  // Always resolve by tenant slug so missing branding.companyId still works
  const { data: companyByTenant, isLoading: loadingByTenant } = useQuery({
    queryKey: ["company-by-identifier", tenant_id],
    queryFn: services.getCompanyByIdentifier(tenant_id),
    enabled: !!tenant_id,
  });

  const companyId =
    validBrandingCompanyId ??
    (companyByTenant?.id != null ? Number(companyByTenant.id) : null) ??
    (companyByTenant?.companyId != null
      ? Number(companyByTenant.companyId)
      : null) ??
    (companyByTenant?.company_id != null
      ? Number(companyByTenant.company_id)
      : null);

  const {
    data: companyData,
    isLoading: loadingById,
    isError: companyLoadError,
    error: companyError,
  } = useQuery({
    queryKey: ["company", companyId],
    queryFn: services.getCompanyById(Number(companyId)),
    enabled: Number.isFinite(companyId as number) && (companyId as number) > 0,
  });

  const tenancyId =
    companyData?.company_identifier ??
    companyData?.companyIdentifier ??
    companyBranding?.company_identifier ??
    tenant_id;

  const { data: brandingFromApi, isLoading: brandingLoading } = useQuery({
    queryKey: ["get company branding info", tenancyId],
    queryFn: services.getCompanyBranding(tenancyId),
    enabled: !!tenancyId,
    retry: false,
  });

  const isLoading =
    loadingByTenant || (Number.isFinite(companyId as number) && loadingById);

  const companyName =
    companyData?.company_name ?? companyData?.companyName ?? "";
  const companyLogo =
    companyData?.company_logo ?? companyData?.companyLogo ?? "";
  const companyIdentifier =
    companyData?.company_identifier ?? companyData?.companyIdentifier ?? "";
  const companyDescription =
    pickCustomValue(companyData, 1) || companyData?.description || "";
  const contactName =
    companyData?.primary_contact_name ??
    companyData?.primaryContactName ??
    "";
  const contactPhone =
    companyData?.primary_contact_phone_number ??
    companyData?.primaryContactPhoneNumber ??
    "";
  const contactEmail =
    companyData?.primary_contact_email ??
    companyData?.primaryContactEmail ??
    "";

  useEffect(() => {
    if (!companyData) return;
    const statuses = [
      { id: 2, name: "Active", value: "ACTIVE" },
      { id: 3, name: "Inactive", value: "INACTIVE" },
    ];
    const status = statuses.find(
      (item) =>
        item.value.toLowerCase() === companyData?.status?.toLowerCase()
    );
    setActiveStatus(status ?? statuses[0]);
  }, [companyData]);

  useEffect(() => {
    const branding = brandingFromApi || companyBranding;
    if (!branding) return;
    setColor(branding?.color || "#1FA35C");
    setSmallLogoUrl(branding?.logo || "");
  }, [brandingFromApi, companyBranding]);

  // Keep local company branding in sync after BrandingSettings saves
  useEffect(() => {
    if (!brandingFromApi) return;
    const {
      id: brandingId,
      companyName: brandingName,
      color: brandingColor,
      companyId: brandingCompanyId,
      logo,
      tenancyId: brandingTenancy,
      modules,
      categorySpecificModules,
    } = brandingFromApi;

    const nextBranding = {
      ...companyBranding,
      modules,
      categorySpecificModules,
      companyModules:
        companyBranding?.companyModules ??
        [
          ...(modules?.map((m: any) => m.moduleName) || []),
          ...(categorySpecificModules?.map((m: any) => m.moduleName) || []),
        ],
      color: brandingColor || companyBranding?.color || "#1FA35C",
      company_identifier: brandingTenancy || tenancyId,
      id: brandingId ?? companyBranding?.id ?? null,
      brandingId: brandingId ?? companyBranding?.brandingId ?? null,
      companyId: brandingCompanyId ?? companyId ?? companyBranding?.companyId,
      logo: logo || companyBranding?.logo || "",
      name: brandingName || companyName || companyBranding?.name,
    };

    if (JSON.stringify(companyBranding) !== JSON.stringify(nextBranding)) {
      setCompanyBranding(nextBranding);
    }
  }, [brandingFromApi]);

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

  if (!companyData) {
    const detail =
      (companyError as any)?.response?.data?.detail ||
      (companyError as any)?.message ||
      null;

    return (
      <div className="px-5 py-16 text-center">
        <h3 className="text-lg font-semibold text-slate-900">
          Company profile unavailable
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          {companyLoadError
            ? "The company API request failed. Try signing out and back in, then refresh."
            : !companyId
              ? `No company record was found for “${tenant_id}”.`
              : "We could not load this company. Try refreshing the page or contact support if the problem continues."}
        </p>
        {detail && (
          <p className="mt-2 text-xs text-slate-400">{String(detail)}</p>
        )}
      </div>
    );
  }

  return (
    <div className="px-5 py-5 pb-8">
      <div className="mb-5 flex w-full items-center justify-between text-primary-dark">
        <h3 className="text-xl font-semibold">Company Profile</h3>

        <Link
          href={`/${tenant_id}/admin/company-profile/edit`}
          style={{ backgroundColor: color || "#0F766E" }}
          className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-white hover:opacity-95"
        >
          <Image src={UpdateInfo} alt="Update Info" />
          Update Information
        </Link>
      </div>

      <div className="flex h-auto min-h-48 w-full flex-col justify-between gap-6 rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-sm sm:flex-row sm:items-center sm:px-9">
        <div className="flex items-center gap-5">
          {companyLogo ? (
            <Image
              src={companyLogo}
              width={144}
              height={144}
              className="h-28 w-28 rounded-full border border-slate-200 object-cover sm:h-36 sm:w-36"
              alt="Company Logo"
            />
          ) : (
            <div className="flex h-28 w-28 items-center justify-center rounded-full border bg-slate-100 sm:h-36 sm:w-36">
              <UserIcon width="50" height="50" />
            </div>
          )}
          <div className="flex flex-col gap-3">
            <div className="label">Company Name</div>
            <div className="header">{companyName || "—"}</div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          {companyIdentifier && (
            <div className="flex flex-col gap-3">
              <div className="label">Marketing page URL</div>
              <button
                className="flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm shadow-sm"
                onClick={() => {
                  const url = `${window.location.origin}/${companyIdentifier}`;
                  navigator.clipboard.writeText(url).then(() => {
                    toast.dismiss();
                    toast.success(`${companyName} marketing page link copied!`);
                  });
                }}
              >
                <VscLink /> Copy Link
              </button>
            </div>
          )}
          {companyData?.status && (
            <div className="flex flex-col gap-3">
              <div className="label">Status</div>
              <button className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm shadow-sm">
                {activeStatus?.name || companyData.status}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-center">
          <Tabs
            filters={filters}
            setActiveFilter={setActiveFilter}
            activeFilter={activeFilter}
          />
        </div>

        <div className="mt-2">
          {activeFilter.value === "description" && (
            <div className="flex-1 py-5 pb-3">
              <div className="group-item">
                <div className="label">Company description</div>
                <div className="value">
                  {companyDescription || "No description set"}
                </div>
              </div>

              <div className="group-item">
                <div className="label">Contact person</div>
                <div className="value">{contactName || "—"}</div>
              </div>

              <div className="flex justify-between gap-6">
                <div className="group-item">
                  <div className="label">Phone Number</div>
                  <div className="value">{contactPhone || "—"}</div>
                </div>
                <div className="group-item">
                  <div className="label">Email</div>
                  <div className="value">{contactEmail || "—"}</div>
                </div>
              </div>
            </div>
          )}

          {activeFilter?.value === "branding_settings" && (
            <div className="py-4">
              <BrandingSettings
                brandingLoading={brandingLoading}
                companySmallLogo={companySmallLogo}
                setCompanySmallLogo={setCompanySmallLogo}
                smallLogoUrl={smallLogoUrl}
                setSmallLogoUrl={setSmallLogoUrl}
                color={color}
                showColorPicker={showColorPicker}
                setShowColorPicker={setShowColorPicker}
                handleChangeComplete={(newColor: any) => setColor(newColor.hex)}
                companyBranding={brandingFromApi || companyBranding}
                companyData={companyData}
              />
            </div>
          )}

          {activeFilter?.value === "sms_sender_id" && (
            <div className="py-4">
              <SMSSenderID company={companyData} companyId={companyId} />
            </div>
          )}

          {activeFilter?.value === "configuration" && (
            <div className="py-4">
              <Configuration tenantId={tenancyId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
