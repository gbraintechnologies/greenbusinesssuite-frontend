"use client";

import ModuleRestrictedAccess from "@/components/ModuleRestrictedAccess/ModuleRestrictedAccess";
import { AvailableModules } from "@/config/modules";
import useCompany from "@/hooks/useCompany";
import React from "react";

function Layout({ children }: any) {
  const { companyBranding: company } = useCompany();

  return (
    <div>
      {company.companyModules.includes(AvailableModules.CompanyProfile) ? (
        children
      ) : (
        <ModuleRestrictedAccess name="Company Profile Settings" />
      )}
    </div>
  );
}

export default Layout;
