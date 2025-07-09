"use client";

import useAuth from "@/hooks/useAuth";
import useCompany from "@/hooks/useCompany";
import { usePathname, useRouter } from "next/navigation";

// Next & React imports
import React, { Suspense, useEffect, use } from "react";

import SetupLoader from "@/components/SetupLoader/SetupLoader";

import { notFound } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import SessionExpiredModal from "@/components/GlobalModal/GlobalModal";

interface layoutProps {
  children: React.ReactNode;
  params: Promise<{ tenantId: string }>;
}

export default function Layout(props: layoutProps) {
  const params: any = use(props.params);

  const { children } = props;

  const tenantId = params.tenantId;

  const { auth, addAuthData } = useAuth();
  const { companyBranding, setCompanyBranding } = useCompany();

  const router = useRouter();

  let pathname = usePathname();

  const { data, isLoading, error } = useQuery({
    queryKey: ["get company branding info", tenantId],
    queryFn: services.getCompanyBranding(tenantId),
    enabled: !!tenantId,
  });

  useEffect(() => {
    if (Boolean(data)) {
      const {
        companyName,
        color,
        companyId,
        logo,
        tenancyId,
        modules,
        categorySpecificModules,
      } = data;

      let allModules = [
        ...(modules?.map((element: any) => element.moduleName) || []),
        ...(categorySpecificModules?.map(
          (element: any) => element.moduleName
        ) || []),
      ];

      // console.log("ALL MODULES", allModules);

      let newBranding = {
        modules,
        categorySpecificModules,
        companyModules: allModules,
        color: color,
        company_identifier: tenancyId,
        id: companyId,
        logo: logo,
        name: companyName,
      };

      // if company branding is null, assign
      if (!!companyBranding) {
        setCompanyBranding(newBranding);
      } else {
        // assign if elements are different (i/e have been changed / updated)
        if (JSON.stringify(companyBranding) !== JSON.stringify(newBranding)) {
          setCompanyBranding(newBranding);
        }
      }
    }
  }, [data, isLoading]);

  if (error) {
    notFound();
  }

  // CHECK IF THERE'S A USER OR COMPANY ADMIN AND REDIRECT TO DASHBOARD
  // ELSE REDIRECT TO AUTH PAGE
  useEffect(() => {
    if (!Boolean(auth?.access_token) && pathname === `/${tenantId}`) {
      router.push(`/${tenantId}/auth`);
    }
  }, [auth, tenantId, companyBranding]);

  useEffect(() => {
    addAuthData({ tenantId: tenantId });
  }, [tenantId, companyBranding]);

  if (!Boolean(companyBranding)) {
    return (
      <div className="w-screen h-screen bg-gradient-to-r from-[#64748B1A] via-[#fff] to-[#F8FAFC] background-animate flex items-center justify-center">
        <SetupLoader />
      </div>
    );
  }

  return (
    <Suspense>
      <SessionExpiredModal />

      {children}
    </Suspense>
  );
}
