"use client";

// Next & React imports
import React, { use } from "react";

import SettingsSideNav from "./components/SettingsSideNav";

export default function SettingsLayout(props: {
  children: React.ReactNode;
  params: Promise<{ tenantId: string }>;
}) {
  const params: any = use(props.params);

  const { children } = props;

  // Redirect to login if not authenticated
  return (
    <div className="w-full h-full">
      <div className="flex flex-row">
        <SettingsSideNav tenantId={params.tenantId} />
        <div className="mt-4 p-2">{children}</div>
      </div>
    </div>
  );
}
