import { useContext } from "react";

import { ClientFormContext } from "@/contexts/ClientFormContext";

export default function useClientForm() {
  const context = useContext(ClientFormContext);

  if (!context) {
    throw new Error(
      "useClientForm must be called within an Form Context Provider"
    );
  }
  return context;
}
