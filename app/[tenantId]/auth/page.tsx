"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, use } from "react";

//
import SetupLoader from "@/components/SetupLoader/SetupLoader";

function Auth(props: any) {
  const params: any = use(props.params);
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
