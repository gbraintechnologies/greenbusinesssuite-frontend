"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

// componetns
import SetupLoader from "@/components/SetupLoader/SetupLoader";

// hooks
import useUser from "@/hooks/useUser";
import useCompany from "@/hooks/useCompany";
import useAuth from "@/hooks/useAuth";

function page({ params }: any) {
  const tenantId = params.tenantId;

  const { user } = useUser();
  const { companyAdmin } = useCompany();
  const { auth } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (auth?.access_token && companyAdmin) {
      router.push(`${tenantId}/admin`);
    } else if (auth?.access_token && user) {
      router.push(`${tenantId}/client`);
    } else {
      router.push(`${tenantId}/auth`);
    }
  }, [auth, user, companyAdmin]);

  return (
    <div className="w-screen h-screen bg-gradient-to-r from-[#64748B1A] via-[#fff] to-[#F8FAFC] background-animate flex items-center justify-center">
      <SetupLoader />
    </div>
  );
}

export default page;
