"use client";

// Next & React imports
import React from "react";

import { usePathname } from "next/navigation";

// Context Provider
import { AdminProvider } from "@/contexts/AdminContext";
import SideNav from "./components/SideNav";
import TopNav from "./components/TopNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Redirect to login if not authenticated
  return (
    <div>
      <AdminProvider>
        <div className="w-full min-h-[100vh]">
          <TopNav />
          <div className="flex flex-row">
            {!pathname.includes("settings") && <SideNav />}

            <div className="mt-4 p-2">{children}</div>
          </div>
        </div>
      </AdminProvider>
    </div>
  );
}
