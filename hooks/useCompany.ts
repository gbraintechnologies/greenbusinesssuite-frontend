import { useContext } from "react";

import { CompanyContext } from "../contexts/CompanyContext";

export default function useCompany() {
  const context = useContext(CompanyContext);

  if (!context) {
    throw new Error(
      "useCompany must be called within an Admin Context Provider"
    );
  }
  return context;
}
