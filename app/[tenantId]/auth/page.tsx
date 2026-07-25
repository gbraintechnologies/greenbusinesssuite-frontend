"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, use } from "react";

//
import SetupLoader from "@/components/SetupLoader/SetupLoader";

function AuthRedirect(props: any) {
  const params: any = use(props.params);
  const tenantId = params?.tenantId;
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    router.push(
      `/${tenantId}/auth/login${query ? `?${query}` : ""}`
    );
  }, [tenantId, router, searchParams]);

  return (
    <div className="w-screen h-screen bg-gradient-to-r from-[#64748B1A] via-[#fff] to-[#F8FAFC] background-animate flex items-center justify-center">
      <SetupLoader />
    </div>
  );
}

function Auth(props: any) {
  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen bg-gradient-to-r from-[#64748B1A] via-[#fff] to-[#F8FAFC] background-animate flex items-center justify-center">
          <SetupLoader />
        </div>
      }
    >
      <AuthRedirect {...props} />
    </Suspense>
  );
}

export default Auth;
