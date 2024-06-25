//
import React, { createContext, useEffect, useState } from "react";

// @ts-ignore
export const CompanyContext = createContext();

// @ts-ignore
const CompanyFromLS =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("company-admin") || null)
    : null;

export const CompanyProvider = ({ children }) => {
  const [companyAdmin, setCompanyAdmin] = useState(CompanyFromLS);

  const addCompanyAdminData = (data) => {
    setCompanyAdmin((prev) => ({ ...prev, ...data }));
  };

  const removeCompanyAdmin = () => {
    setCompanyAdmin(null);
  };

  useEffect(() => {
    localStorage.setItem("company-admin", JSON.stringify(companyAdmin));
  }, [companyAdmin]);

  return (
    <CompanyContext.Provider
      value={{
        companyAdmin,
        addCompanyAdminData,
        removeCompanyAdmin,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

// ls undefinied in next: https://stackoverflow.com/questions/73853069/solve-referenceerror-localstorage-is-not-defined-in-next-js
