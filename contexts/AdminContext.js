import React, { createContext, useEffect, useState } from "react";

// @ts-ignore
export const AdminContext = createContext();

// @ts-ignore
export const AdminProvider = ({ children }) => {
  // Always start null so SSR and the first client render match.
  // localStorage is read after mount to avoid hydration mismatches.
  const [admin, setAdmin] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [hasHydrated, setHasHydrated] = useState(false);

  const addAdminData = (data) => {
    setAdmin((prev) => ({ ...prev, ...data }));
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem("admin");
      if (stored && stored !== "null") {
        const parsed = JSON.parse(stored);
        setAdmin(parsed);
        setPermissions(parsed?.permissions ?? null);
      }
    } catch {
      // Ignore invalid stored admin payloads.
    }
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (permissions == null && admin) {
      setPermissions(admin?.permissions);
    }
  }, [admin, permissions]);

  const checkPermission = (name) => {
    // use name to check if permissions belongs to user
    return Boolean(permissions?.some((item) => item?.permission_name == name));
  };

  const removeAdmin = () => {
    setAdmin(null);
  };

  useEffect(() => {
    if (!hasHydrated) return;
    localStorage.setItem("admin", JSON.stringify(admin));
  }, [admin, hasHydrated]);

  return (
    <AdminContext.Provider
      value={{
        admin,
        setAdmin,
        permissions,
        checkPermission,
        addAdminData,
        removeAdmin,
        hasHydrated,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

// ls undefinied in next: https://stackoverflow.com/questions/73853069/solve-referenceerror-localstorage-is-not-defined-in-next-js
