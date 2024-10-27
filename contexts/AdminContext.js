import React, { createContext, useEffect, useState } from "react";

// @ts-ignore
export const AdminContext = createContext();

// @ts-ignore
const UserFromLS =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("admin") || null)
    : null;

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(UserFromLS);

  const addAdminData = (data) => {
    setAdmin((prev) => ({ ...prev, ...data }));
  };

  const [permissions, setPermissions] = useState(
    UserFromLS ? UserFromLS?.permissions : null
  );

  useEffect(() => {
    if (permissions == null && admin) {
      setPermissions(admin?.permissions);
    }
  }, [admin]);

  const checkPermission = (name) => {
    // use name to check if permissions belongs to user
    return Boolean(permissions?.some((item) => item?.permission_name == name));
  };

  const removeAdmin = () => {
    setAdmin(null);
  };

  useEffect(() => {
    //
    localStorage.setItem("admin", JSON.stringify(admin));
  }, [admin]);

  return (
    <AdminContext.Provider
      value={{
        admin,
        setAdmin,
        permissions,
        checkPermission,
        addAdminData,
        removeAdmin,
        permissions,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

// ls undefinied in next: https://stackoverflow.com/questions/73853069/solve-referenceerror-localstorage-is-not-defined-in-next-js
