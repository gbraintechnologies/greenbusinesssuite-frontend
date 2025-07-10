"use client";

import useAdmin from "@/hooks/useAdmin";
import { PermissionTypes } from "@/types/permissionTypes";
import { usePathname } from "next/navigation";
import React from "react";

function Layout({
  children,
  managecurrency,
}: {
  children: React.ReactNode;
  managecurrency: React.ReactNode;
}) {
  const pathname = usePathname();

  const { checkPermission } = useAdmin();

  return (
    <div>
      {children}
      {checkPermission(PermissionTypes.READ_ALL_CURRENCIES) &&
        pathname == "/currency-setup" &&
        managecurrency}
    </div>
  );
}

export default Layout;