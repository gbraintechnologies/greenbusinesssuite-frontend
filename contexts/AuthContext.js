import React, { createContext, useEffect, useState } from "react";

// @ts-ignore
export const AuthContext = createContext();

// @ts-ignore
export const AuthProvider = ({ children }) => {
  // Always start null so SSR and the first client render match.
  const [auth, setAuth] = useState(null);
  const [hasHydrated, setHasHydrated] = useState(false);

  const addAuthData = (data) => {
    setAuth((prev) => ({ ...prev, ...data }));
  };

  const removeAuth = () => {
    setAuth(null);
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem("auth");
      if (stored && stored !== "null") {
        setAuth(JSON.parse(stored));
      }
    } catch {
      // Ignore invalid stored auth payloads.
    }
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth, hasHydrated]);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        addAuthData,
        removeAuth,
        hasHydrated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ls undefinied in next: https://stackoverflow.com/questions/73853069/solve-referenceerror-localstorage-is-not-defined-in-next-js
