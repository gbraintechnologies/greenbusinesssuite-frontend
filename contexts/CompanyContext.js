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

export const CompanyProvider = ({ children }) => {
  const [companyAdmin, setCompanyAdmin] = useState(CompanyFromLS);
  const [company, setCompany] = useState(null);

  const {
    data: companyData,
    isLoading,
    refetch,
  } = useQuery({
    // @ts-ignore
    queryKey: [
      "company",
      parseInt(companyAdmin?.custom_profile_values[0]?.value),
    ],
    queryFn: services.getCompanyById(
      Number(companyAdmin?.custom_profile_values[0]?.value)
    ),
    enabled: Boolean(companyAdmin?.custom_profile_values[0]?.value),
  });

  useEffect(() => {
    if (Boolean(companyData)) {
      setCompany(companyData);
    } else {
      if (
        Boolean(companyAdmin?.custom_profile_values[0]?.id) &&
        !Boolean(company)
      ) {
        refetch();
      }
    }
  }, [companyAdmin, companyData, isLoading]);

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
        company,
        setCompany,
        addCompanyAdminData,
        removeCompanyAdmin,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

// ls undefinied in next: https://stackoverflow.com/questions/73853069/solve-referenceerror-localstorage-is-not-defined-in-next-js
