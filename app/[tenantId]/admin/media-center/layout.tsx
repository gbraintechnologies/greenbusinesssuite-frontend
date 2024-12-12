"use client";

import ModuleRestrictedAccess from "@/components/ModuleRestrictedAccess/ModuleRestrictedAccess";
import { AvailableModules } from "@/config/modules";
import useCompany from "@/hooks/useCompany";
import React from "react";
import { usePathname } from "next/navigation";

function Layout({ children, content }: any) {
  const { companyBranding: company } = useCompany();
  const pathname = usePathname();
  return (
    <div>
      {pathname == `/${company?.company_identifier}/admin/media-center` && content}
      {company.companyModules.includes(AvailableModules.MediaCenter) ? (
        children
      ) : (
        <ModuleRestrictedAccess name="Media Center" />
      )}
    </div>
  );
}

export default Layout;
