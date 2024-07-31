"use client";

import useAuth from "@/hooks/useAuth";
import useCompany from "@/hooks/useCompany";
import { usePathname, useRouter } from "next/navigation";

// Next & React imports
import React, { Suspense, useEffect, useState } from "react";

import Checks from "./_components/Checks";

interface layoutProps {
  children: React.ReactNode;
  params: { tenantId: string };
}

export default function Layout({ children, params }: layoutProps) {
  const tenantId = params.tenantId;

  const { auth, addAuthData } = useAuth();
  const { companyBranding } = useCompany();

  let pathname = usePathname();

  const router = useRouter();

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
        <Checks />
      </div>
    );
  }

  return <Suspense>{children}</Suspense>;
}
