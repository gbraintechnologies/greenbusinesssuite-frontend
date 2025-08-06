"use client";

import useAdmin from "@/hooks/useAdmin";
import { PermissionTypes } from "@/types/permissionTypes";
import { usePathname } from "next/navigation";
import React from "react";

function Layout({ children, managecompanies }: any) {
  const pathname = usePathname();

  const { checkPermission } = useAdmin();

  return (
    <div>
      {children}
      {/* TODO: ENABLE AFTER PERMISIONS */}
      {/* {checkPermission(PermissionTypes.READ_ALL_USERS) &&
        pathname == "/company-setup" &&
        managecompanies} */}
      {managecompanies}
    </div>
  );
}

export default Layout;
