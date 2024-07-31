"use client";

import useAuth from "@/hooks/useAuth";
import useCompany from "@/hooks/useCompany";
import { usePathname, useRouter } from "next/navigation";

// Next & React imports
import React, { Suspense, useEffect, useState } from "react";

import { AiOutlineLoading } from "react-icons/ai";

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

  //  company_identifier: "adidas84758",
  // add to auth the tenantid / company identifier so that requests use it

  // USE CONTEXT TO STORE COMPANY BRANDING INFO

  const statusText = [
    { id: 0, text: "Setting up your organization" },
    { id: 1, text: "Gathering required resources" },
    { id: 2, text: "Please wait a moment" },
    { id: 3, text: "Loading interface components" },
    { id: 4, text: "Taking a bit longer than usual" },
    { id: 5, text: "Finalizing initialization" },
  ];

  const [currentStatus, setCurrentStatus] = useState(statusText[0]);

  useEffect(() => {
    if (!Boolean(companyBranding)) {
      setTimeout(() => {
        if (currentStatus.id === 5) {
          setCurrentStatus(statusText[0]);
        } else {
          setCurrentStatus(statusText[currentStatus.id + 1]);
        }
      }, 2000);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStatus]);

  if (!Boolean(companyBranding)) {
    return (
      <div className="flex items-center justify-center gap-10 w-screen h-screen bg-gradient-to-r from-[#64748B1A] via-[#fff] to-[#F8FAFC] background-animate">
        <div className="flex flex-col gap-2">
          <AiOutlineLoading className="animate-spin text-gray-500" />
          <p className="text-sm text-gray-500 animate-fade">
            {currentStatus.text}
          </p>
          <div className="h-8 w-52 bg-gray-300 rounded-xl animate-pulse" />
          {currentStatus.id % 2 == 0 ? (
            <div className="h-5 w-48 bg-gray-300 rounded-xl animate-pulse" />
          ) : (
            <div className="h-5 w-56 bg-gray-300 rounded-xl animate-pulse" />
          )}
        </div>
      </div>
    );
  }

  return <Suspense>{children}</Suspense>;
}
