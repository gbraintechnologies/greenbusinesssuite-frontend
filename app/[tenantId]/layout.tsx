"use client";

import useAuth from "@/hooks/useAuth";
import useCompany from "@/hooks/useCompany";
import { usePathname, useRouter } from "next/navigation";

// Next & React imports
import React, { Suspense, useEffect } from "react";

import SetupLoader from "@/components/SetupLoader/SetupLoader";

import { notFound } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";

interface layoutProps {
  children: React.ReactNode;
  params: { tenantId: string };
}

export default function Layout({ children, params }: layoutProps) {
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
      const { companyName, color, companyId, logo, tenancyId } = data;

      let newBranding = {
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
    console.log("error", error);
    notFound();
  }

  // CHECK IF THERE'S A USER OR COMPANY ADMIN AND REDIRECT TO DASHBOARD
  // ELSE REDIRECT TO AUTH PAGE
  useEffect(() => {
    if (!Boolean(auth?.access_token) && pathname === `/${tenantId}`) {
      router.push(`/${tenantId}/auth`);
    }
  }, [auth, tenantId]);

  useEffect(() => {
    addAuthData({ tenantId: tenantId });
  }, [tenantId]);

  if (!Boolean(companyBranding)) {
    return (
      <div className="w-screen h-screen bg-gradient-to-r from-[#64748B1A] via-[#fff] to-[#F8FAFC] background-animate flex items-center justify-center">
        <SetupLoader />
      </div>
    );
  }

  return <Suspense>{children}</Suspense>;
}
