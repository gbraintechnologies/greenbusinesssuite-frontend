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
        addAdminData,
        removeAdmin,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

// ls undefinied in next: https://stackoverflow.com/questions/73853069/solve-referenceerror-localstorage-is-not-defined-in-next-js
