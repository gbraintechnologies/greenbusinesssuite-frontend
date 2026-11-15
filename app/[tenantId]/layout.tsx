"use client";

import useAuth from "@/hooks/useAuth";
import useCompany from "@/hooks/useCompany";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Next & React imports
import React, { Suspense, useEffect, use } from "react";

import SetupLoader from "@/components/SetupLoader/SetupLoader";

import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import SessionExpiredModal from "@/components/GlobalModal/GlobalModal";
import { CoreModules } from "@/config/modules";

interface layoutProps {
  children: React.ReactNode;
  params: Promise<{ tenantId: string }>;
}

function buildFallbackBranding(
  tenantId: string,
  companyName: string,
  companyId: number | string | null = null
) {
  return {
    modules: [],
    categorySpecificModules: [],
    companyModules: CoreModules,
    color: "#1FA35C",
    company_identifier: tenantId,
    // branding record id (unknown until branding is created)
    id: null,
    brandingId: null,
    // numeric company PK used by company profile APIs
    companyId,
    logo: "",
    name: companyName || "Company",
  };
}

function TenantLayoutInner(props: layoutProps) {
  const params: any = use(props.params);

  const { children } = props;

  const tenantId = params.tenantId;
  const searchParams = useSearchParams();
  const companyNameFromLink = searchParams.get("c")?.trim() || "";

  const { auth, addAuthData } = useAuth();
  const { companyBranding, setCompanyBranding, storageReady } = useCompany();

  const router = useRouter();

  let pathname = usePathname();

  const brandingMatchesTenant =
    companyBranding?.company_identifier === tenantId;

  const { data, isLoading, error, isFetched } = useQuery({
    queryKey: ["get company branding info", tenantId],
    queryFn: services.getCompanyBranding(tenantId),
    enabled: !!tenantId,
    retry: 1,
  });

  // Resolve company record when branding is missing or lacks a companyId
  const shouldLookupCompany =
    !!tenantId &&
    isFetched &&
    (!data || !data?.companyId);

  const { data: companyByIdentifier, isFetched: companyLookupFetched } =
    useQuery({
      queryKey: ["get company by identifier", tenantId],
      queryFn: services.getCompanyByIdentifier(tenantId),
      enabled: shouldLookupCompany,
      retry: 0,
    });

  const resolvedCompanyName =
    data?.companyName ||
    companyNameFromLink ||
    companyByIdentifier?.companyName ||
    companyByIdentifier?.company_name ||
    "";

  // Apply branding from API when available
  useEffect(() => {
    if (!data) return;

    const {
      id: brandingId,
      companyName,
      color,
      companyId,
      logo,
      tenancyId,
      modules,
      categorySpecificModules,
    } = data;

    const allModules = [
      ...(modules?.map((element: any) => element.moduleName) || []),
      ...(categorySpecificModules?.map(
        (element: any) => element.moduleName
      ) || []),
    ];

    // Branding with no modules assigned should still expose core portal features
    const companyModules =
      allModules.length > 0 ? allModules : CoreModules;

    const newBranding = {
      modules,
      categorySpecificModules,
      companyModules,
      color: color || "#1FA35C",
      company_identifier: tenancyId || tenantId,
      // Keep branding PK and company PK distinct (profile pages need companyId)
      id: brandingId ?? null,
      brandingId: brandingId ?? null,
      companyId: companyId ?? null,
      logo: logo || "",
      name:
        companyName ||
        companyNameFromLink ||
        companyByIdentifier?.companyName ||
        "Company",
    };

    if (
      !companyBranding ||
      JSON.stringify(companyBranding) !== JSON.stringify(newBranding)
    ) {
      setCompanyBranding(newBranding);
    }
  }, [data, tenantId, companyNameFromLink, companyByIdentifier]);

  // Branding missing — use real company name from link (?c=) or company lookup
  useEffect(() => {
    if (!isFetched || data || isLoading) return;
    if (!(error || !data)) return;

    // Wait for company lookup when we need it
    if (shouldLookupCompany && !companyLookupFetched) return;

    const realName = resolvedCompanyName || "Company";
    const resolvedCompanyId =
      companyByIdentifier?.id ??
      companyByIdentifier?.companyId ??
      companyByIdentifier?.company_id ??
      null;

    const needsFallback =
      !brandingMatchesTenant ||
      !companyBranding?.name ||
      companyBranding.name === "Green Business Suite" ||
      companyBranding.name === "MeshSuite" ||
      companyBranding.name === tenantId ||
      !companyBranding?.companyId ||
      (realName &&
        companyBranding.name !== realName &&
        companyBranding.name.toLowerCase() === tenantId.toLowerCase());

    if (needsFallback) {
      setCompanyBranding(
        buildFallbackBranding(tenantId, realName, resolvedCompanyId)
      );
    }
  }, [
    error,
    data,
    isFetched,
    isLoading,
    brandingMatchesTenant,
    companyBranding?.name,
    companyBranding?.companyId,
    tenantId,
    resolvedCompanyName,
    shouldLookupCompany,
    companyLookupFetched,
    companyByIdentifier,
  ]);

  // CHECK IF THERE'S A USER OR COMPANY ADMIN AND REDIRECT TO DASHBOARD
  // ELSE REDIRECT TO AUTH PAGE
  useEffect(() => {
    if (!Boolean(auth?.access_token) && pathname === `/${tenantId}`) {
      router.push(`/${tenantId}/auth`);
    }
  }, [auth, tenantId, companyBranding]);

  useEffect(() => {
    addAuthData({ tenantId: tenantId });
  }, [tenantId]);

  // Wait until branding for THIS tenant is ready with a real name when possible
  const waitingForCompanyName =
    shouldLookupCompany && !companyLookupFetched && !brandingMatchesTenant;

  // storageReady is false on server + first client paint → same loader HTML (no mismatch)
  if (!storageReady || !brandingMatchesTenant || waitingForCompanyName) {
    return (
      <div className="w-screen h-screen bg-gradient-to-r from-[#64748B1A] via-[#fff] to-[#F8FAFC] background-animate flex items-center justify-center">
        <SetupLoader />
      </div>
    );
  }

  return (
    <>
      <SessionExpiredModal />
      {children}
    </>
  );
}

export default function Layout(props: layoutProps) {
  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen bg-gradient-to-r from-[#64748B1A] via-[#fff] to-[#F8FAFC] background-animate flex items-center justify-center">
          <SetupLoader />
        </div>
      }
    >
      <TenantLayoutInner {...props} />
    </Suspense>
  );
}
