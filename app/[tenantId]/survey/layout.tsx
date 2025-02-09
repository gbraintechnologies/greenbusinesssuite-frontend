"use client";

// Next & React imports
import React, { Suspense } from "react";

import { ClientPublicFormProvider } from "@/contexts/ClientPublicForm";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <ClientPublicFormProvider>{children}</ClientPublicFormProvider>
    </Suspense>
  );
}
