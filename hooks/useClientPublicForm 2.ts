import { useContext } from "react";

import { ClientPublicFormContext } from "@/contexts/ClientPublicForm";

export default function useClientPublicForm() {
  const context = useContext(ClientPublicFormContext);

  if (!context) {
    throw new Error(
      "useClientForm must be called within an Form Context Provider"
    );
  }
  return context;
}
