//
import React, { createContext, useEffect, useState } from "react";

// @ts-ignore
export const CompanyContext = createContext();

function readJson(storage, key) {
  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const CompanyProvider = ({ children }) => {
  // Always start null so SSR HTML matches the client's first paint
  const [companyAdmin, setCompanyAdmin] = useState(null);
  const [company, setCompany] = useState(null);
  const [companyBranding, setCompanyBranding] = useState(null);
  const [storageReady, setStorageReady] = useState(false);

  const addCompanyAdminData = (data) => {
    setCompanyAdmin((prev) => ({ ...prev, ...data }));
  };

  const removeCompanyAdmin = () => {
    setCompanyAdmin(null);
  };

  // Hydrate from browser storage after mount (avoids hydration mismatch)
  useEffect(() => {
    setCompanyAdmin(readJson(localStorage, "company-admin"));
    setCompanyBranding(readJson(sessionStorage, "company-branding"));
    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    localStorage.setItem("company-admin", JSON.stringify(companyAdmin));
  }, [companyAdmin, storageReady]);

  useEffect(() => {
    if (!storageReady) return;
    sessionStorage.setItem("company-branding", JSON.stringify(companyBranding));
  }, [companyBranding, storageReady]);

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
        storageReady,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

// ls undefined in next: https://stackoverflow.com/questions/73853069/solve-referenceerror-localstorage-is-not-defined-in-next-js
