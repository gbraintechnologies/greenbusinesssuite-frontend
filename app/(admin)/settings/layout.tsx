"use client";

// Next & React imports
import React from "react";

// Context Provider
import { AdminProvider } from "@/contexts/AdminContext";

import TopNav from "../components/TopNav";
import SettingsSideNav from "./components/SettingsSideNav";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Redirect to login if not authenticated
  return (
    <div>
      <AdminProvider>
        <div className="w-full h-full">
          <div className="flex flex-row">
            <SettingsSideNav />
            <div className="mt-4 p-2">{children}</div>
          </div>
        </div>
      </AdminProvider>
    </div>
  );
}
