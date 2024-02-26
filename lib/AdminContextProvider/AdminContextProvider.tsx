"use client";

import { AdminProvider } from "@/contexts/AdminContext";

const AdminContextProvider = ({ children }: any) => {
  return <AdminProvider>{children}</AdminProvider>;
};

export default AdminContextProvider;
