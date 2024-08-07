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
  const [company, setCompany] = useState(CompanyBrandingFromSS);

  // TODO: KEEP COMPANY BRANDING IN SESSION STORAGE TO REDUCE CALLS
  const [companyBranding, setCompanyBranding] = useState(null);

  // {
  //   id: 2,
  //   name: "Adidas",
  //   color: "#E32527",
  //   logo: "https://mesh-suite-pics-staging-bucket.s3.amazonaws.com/Resources/file-37f2ae99b9c11916fc9e112a54f4355090a13600939ddccc7e4902a53cfe9125.png",
  //   company_identifier: "adidas84758",
  // }

  // const {
  //   data: companyData,
  //   isLoading,
  //   refetch,
  // } = useQuery({
  //   // @ts-ignore
  //   queryKey: ["company", parseInt(auth?.companyId)],
  //   queryFn: services.getCompanyById(Number(auth?.company_id)),
  //   enabled: Boolean(auth?.company_id && auth?.company_id !== 0),
  // });

  // // update auth
  // useEffect(() => {
  //   setAuth(UserFromLS);
  // }, [companyAdmin]);

  // useEffect(() => {
  //   if (Boolean(companyData)) {
  //     setCompany(companyData);
  //   } else {
  //     if (Boolean(auth?.company_id) && !Boolean(company)) {
  //       refetch();
  //     }
  //   }
  // }, [companyAdmin, companyData, isLoading]);

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
