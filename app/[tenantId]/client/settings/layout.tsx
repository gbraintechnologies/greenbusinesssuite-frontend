"use client";

// Next & React imports
import React, { Suspense, useEffect } from "react";

import SettingsSideNav from "./components/SettingsSideNav";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <div className="w-full h-full">
        <div className="flex flex-row">
          <SettingsSideNav />
          <div className="mt-4 p-2 w-full flex flex-col items-start">
            {children}
          </div>
        </div>
      </div>
    </Suspense>
  );
}
