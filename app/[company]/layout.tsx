"use client";

// Next & React imports
import React, { Suspense } from "react";

interface layoutProps {
  children: React.ReactNode;
  params: { id: string };
}

export default function Layout({ children, params }: layoutProps) {
  // TODO: CHECK IF COMPANY BRANDING INFO IS LOADED ELSE PUSH TO PAGE

  console.log("company id", params?.id);
  return <Suspense>{children}</Suspense>;
}
