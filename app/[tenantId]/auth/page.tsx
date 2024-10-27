"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

//
import SetupLoader from "@/components/SetupLoader/SetupLoader";

function Auth({ params }: any) {
  const tenantId = params?.tenantId;
  const router = useRouter();

  useEffect(() => {
    router.push(`/${tenantId}/auth/login`);
  }, []);
  return (
    <div className="w-screen h-screen bg-gradient-to-r from-[#64748B1A] via-[#fff] to-[#F8FAFC] background-animate flex items-center justify-center">
      <SetupLoader />
    </div>
  );
}

export default Auth;
