"use client";

import ModuleRestrictedAccess from "@/components/ModuleRestrictedAccess/ModuleRestrictedAccess";
import { AvailableModules } from "@/config/modules";
import useCompany from "@/hooks/useCompany";
import React from "react";

function Layout({ children, content }: any) {
  const { companyBranding: company } = useCompany();

  return (
    <div>
      {children}

      {company.companyModules.includes(AvailableModules.UserManagement) ? (
        content
      ) : (
        <ModuleRestrictedAccess name="User Management" />
      )}
    </div>
  );
}

export default Layout;
