import { useContext } from "react";

import { AdminContext } from "../contexts/AdminContext";

export default function useAdmin() {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error("useAdmin must be called within an Admin Context Provider");
  }
  return context;
}
