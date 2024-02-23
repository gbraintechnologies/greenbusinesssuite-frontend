"use client";

// Next & React imports
import React from "react";

// Context Provider
import { AdminProvider } from "@/contexts/AdminContext";
import SideNav from "./components/SideNav";
import TopNav from "./components/TopNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Redirect to login if not authenticated
  return (
    <div>
      <AdminProvider>
        <div className="w-full min-h-[100vh]">
          <TopNav />
          <div className="flex flex-row">
            <SideNav />
            <div className="mt-4 p-2">{children}</div>
          </div>
        </div>
      </AdminProvider>
    </div>
  );
}
