"use client";

import useAdmin from "@/hooks/useAdmin";
import { PermissionTypes } from "@/types/permissionTypes";
import { usePathname } from "next/navigation";
import React from "react";

function Layout({
  children,
  manageusers,
}: {
  children: React.ReactNode;
  manageusers: React.ReactNode;
}) {
  const pathname = usePathname();

  const { checkPermission } = useAdmin();

  return (
    <div>
      {children}
      {/* TODO: Enable after permission checks */}
      {/* {checkPermission(PermissionTypes.READ_ALL_USERS) &&
        pathname == "/usermanagement" &&
        manageusers} */}
      {manageusers}
    </div>
  );
}

export default Layout;
