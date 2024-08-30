"use client";

import useAdmin from "@/hooks/useAdmin";
import { PermissionTypes } from "@/types/permissionTypes";
import { usePathname } from "next/navigation";
import React from "react";

function Layout({
  children,
  managecompanies,
}: {
  children: React.ReactNode;
  managecompanies: React.ReactNode;
}) {
  const pathname = usePathname();

  const { checkPermission } = useAdmin();

  return (
    <div>
      {children}
      {checkPermission(PermissionTypes.READ_ALL_USERS) &&
        pathname == "/company-setup" &&
        managecompanies}
    </div>
  );
}

export default Layout;
