"use client";

import ModuleRestrictedAccess from "@/components/ModuleRestrictedAccess/ModuleRestrictedAccess";
import { AvailableModules, CoreModules } from "@/config/modules";
import useCompany from "@/hooks/useCompany";
import React from "react";

function Layout({ children }: any) {
  const { companyBranding: company } = useCompany();

  const modules =
    company?.companyModules?.length > 0
      ? company.companyModules
      : CoreModules;

  const hasAccess = modules.includes(AvailableModules.CompanyProfile);

  return (
    <div>
      {hasAccess ? (
        children
      ) : (
        <ModuleRestrictedAccess name="Company Profile Settings" />
      )}
    </div>
  );
}

export default Layout;
