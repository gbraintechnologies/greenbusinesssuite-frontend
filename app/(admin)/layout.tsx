"use client";

import useAdmin from "@/hooks/useAdmin";
import services from "@/services";
import { useQuery } from "@tanstack/react-query";
// Next & React imports
import React, { Suspense, useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  // check for permissions

  const { admin, addAdminData } = useAdmin();

  // const { data: role, isLoading } = useQuery({
  //   queryKey: ["permissions", admin],
  //   queryFn: services.RoleByID(admin?.profiles[0]?.role_id),
  //   enabled: Boolean(admin),
  // });

  // useEffect(() => {
  //   if (role) {
  //     addAdminData(role);
  //   }
  // }, [role, isLoading]);

  return <Suspense>{children}</Suspense>;
}
