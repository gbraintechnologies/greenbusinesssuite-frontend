//
import services from "@/services";
import { useQuery } from "@tanstack/react-query";
import React, { createContext, useEffect, useState } from "react";

// @ts-ignore
export const CompanyContext = createContext();

// @ts-ignore
const CompanyFromLS =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("company-admin") || null)
    : null;

const CompanyBrandingFromSS =
  typeof window !== "undefined"
    ? JSON.parse(sessionStorage.getItem("company-branding") || null)
    : null;

// @ts-ignore
const UserFromLS =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("auth") || null)
    : null;

export const CompanyProvider = ({ children }) => {
  //
  const [auth, setAuth] = useState(UserFromLS);
  const [companyAdmin, setCompanyAdmin] = useState(CompanyFromLS);

  // raw company info
  const [company, setCompany] = useState(null);

  // company branding info
  const [companyBranding, setCompanyBranding] = useState(CompanyBrandingFromSS);

  const addCompanyAdminData = (data) => {
    setCompanyAdmin((prev) => ({ ...prev, ...data }));
  };

  const removeCompanyAdmin = () => {
    setCompanyAdmin(null);
  };

  useEffect(() => {
    localStorage.setItem("company-admin", JSON.stringify(companyAdmin));
  }, [companyAdmin]);

  useEffect(() => {
    sessionStorage.setItem("company-branding", JSON.stringify(companyBranding));
  }, [companyBranding]);
  return (
    <CompanyContext.Provider
      value={{
        companyAdmin,
        company,
        setCompany,
        companyBranding,
        setCompanyBranding,
        addCompanyAdminData,
        removeCompanyAdmin,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

// ls undefinied in next: https://stackoverflow.com/questions/73853069/solve-referenceerror-localstorage-is-not-defined-in-next-js
