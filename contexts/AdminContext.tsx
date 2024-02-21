import React, { createContext, useEffect, useState } from "react";

// @ts-ignore
export const AdminContext = createContext();

// @ts-ignore
const UserFromLS = JSON.parse(localStorage.getItem("admin") || null);

export const AdminProvider = ({ children }: any) => {
  const [admin, setAdmin] = useState(UserFromLS);

  useEffect(() => {
    //
    localStorage.setItem("admin", JSON.stringify(admin));
  }, [admin]);

  const addAdminData = (data: any) => {
    setAdmin({ ...admin, ...data });
  };

  const removeAdmin = () => {
    setAdmin(null);
  };

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
