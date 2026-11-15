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
    <div className="px-5 py-5 pb-5">
      <div className="w-full text-primary-dark flex justify-between items-center">
        <h3 className="font-semibold text-xl">Company Profile</h3>

        <div className="flex gap-3">
          <Link
            href={`/${tenant_id}/admin/company-profile/edit`}
            style={{ backgroundColor: color || "#0F766E" }}
            className="disabled:bg-gray-400 py-3 flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
          >
            <Image src={UpdateInfo} alt="Update Info" />
            Update Information
          </Link>
        </div>
      </div>

      <div className="w-full mt-4 px-9 py-4 flex justify-between items-center bg-[#F8FAFC] h-48 rounded-xl">
        <div className="flex gap-5 items-center justify-center">
          {companyLogo ? (
            <Image
              src={companyLogo}
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
          <div className="flex flex-col gap-3">
            <div className="label">Company Name</div>
            <div className="header">{companyName || "—"}</div>
          </div>
        </div>
        <div className="flex gap-6 items-center">
          {companyIdentifier && (
            <div className="flex flex-col gap-3">
              <div className="label">Marketing page URL</div>
              <button
                className=" border border-[rgba(226, 232, 240, 1)] text-sm bg-white flex items-center justify-center h-9 rounded-lg shadow-[0px_2px_8px_0px_rgba(100, 116, 139, 0.1)] gap-2 px-3"
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
              <div className="z-20 relative inline-block">
                <button className=" border border-[rgba(226, 232, 240, 1)] text-sm bg-white flex items-center h-9 rounded-lg shadow-[0px_2px_8px_0px_rgba(100, 116, 139, 0.1)] gap-2 px-3">
                  {activeStatus?.name || companyData.status}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10">
        <div className="flex justify-center items-center">
          <Tabs
            filters={filters}
            setActiveFilter={setActiveFilter}
            activeFilter={activeFilter}
          />
        </div>

        <div>
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
          )}

          {activeFilter?.value === "sms_sender_id" && (
            <SMSSenderID company={companyData} companyId={companyId} />
          )}

          {activeFilter?.value === "configuration" && (
            <Configuration tenantId={tenancyId} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
