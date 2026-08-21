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

function buildFallbackBranding(tenantId: string, companyName: string) {
  return {
    modules: [],
    categorySpecificModules: [],
    companyModules: CoreModules,
    color: "#7C3AED",
    company_identifier: tenantId,
    id: null,
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

  // When branding is missing, resolve the real company name by identifier
  const shouldLookupCompany =
    !!tenantId && isFetched && !data && !companyNameFromLink;

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

    const newBranding = {
      modules,
      categorySpecificModules,
      companyModules: allModules,
      color: color || "#7C3AED",
      company_identifier: tenancyId || tenantId,
      id: companyId,
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
    const needsFallback =
      !brandingMatchesTenant ||
      !companyBranding?.name ||
      companyBranding.name === "Green Business Suite" ||
      companyBranding.name === "MeshSuite" ||
      companyBranding.name === tenantId ||
      (realName &&
        companyBranding.name !== realName &&
        companyBranding.name.toLowerCase() === tenantId.toLowerCase());

    if (needsFallback) {
      setCompanyBranding(buildFallbackBranding(tenantId, realName));
    }
  }, [
    error,
    data,
    isFetched,
    isLoading,
    brandingMatchesTenant,
    companyBranding?.name,
    tenantId,
    resolvedCompanyName,
    shouldLookupCompany,
    companyLookupFetched,
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
