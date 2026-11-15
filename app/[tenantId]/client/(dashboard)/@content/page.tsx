"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useCompany from "@/hooks/useCompany";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";

/** Legacy /{tenant}/client root → dashboard */
export default function ClientRootRedirect() {
  const router = useRouter();
  const { companyBranding: company } = useCompany();
  const tenant = company?.company_identifier;

  useEffect(() => {
    if (tenant) {
      router.replace(`/${tenant}/client/dashboard`);
    }
  }, [tenant, router]);

  return (
    <div className="flex h-[50vh] items-center justify-center">
      <LoadingIcon />
    </div>
  );
}
