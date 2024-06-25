"use client";

import { CompanyProvider } from "@/contexts/CompanyContext";

const CompanyContextProvider = ({ children }: any) => {
  return <CompanyProvider>{children}</CompanyProvider>;
};

export default CompanyContextProvider;
