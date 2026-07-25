"use client";

import React from "react";
import SettingsSideNav from "./components/SettingsSideNav";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-muted px-5 pb-20 pt-5">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 lg:flex-row">
        <SettingsSideNav />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
