"use client";

// Next & React imports
import React from "react";

// Context Provider
import { AdminProvider } from "@/contexts/AdminContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Redirect to login if not authenticated

  return (
    <div>
      <AdminProvider>{children}</AdminProvider>
    </div>
  );
}
