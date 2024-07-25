"use client";

// Next & React imports
import React, { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  // TODO: CHECK IF COMPANY BRANDING INFO IS LOADED ELSE PUSH TO PAGE
  return <Suspense>{children}</Suspense>;
}
