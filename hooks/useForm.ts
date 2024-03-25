import { useContext } from "react";

import { FormContext } from "../contexts/FormContext";

export default function useForm() {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error("useForm must be called within an Form Context Provider");
  }
  return context;
}
