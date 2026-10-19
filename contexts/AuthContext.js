import React, { createContext, useEffect, useState } from "react";
import { signOut } from "@/services/features/authService";

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

  // User-initiated logout: revoke on the server (best effort), then clear locally.
  const logout = () => {
    signOut().catch(() => {});
    removeAuth();
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

  // Interceptor refresh updates localStorage + fires this event. Sync React
  // state so the persist effect below cannot clobber fresh tokens.
  useEffect(() => {
    const onTokensUpdated = (event) => {
      const { accessToken, refreshToken } = event.detail || {};
      if (!accessToken) return;
      setAuth((prev) =>
        prev
          ? { ...prev, accessToken, refreshToken }
          : { accessToken, refreshToken }
      );
    };

    window.addEventListener("authTokensUpdated", onTokensUpdated);
    return () => {
      window.removeEventListener("authTokensUpdated", onTokensUpdated);
    };
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    if (auth == null) {
      localStorage.removeItem("auth");
      return;
    }
    localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth, hasHydrated]);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        addAuthData,
        removeAuth,
        logout,
        hasHydrated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ls undefinied in next: https://stackoverflow.com/questions/73853069/solve-referenceerror-localstorage-is-not-defined-in-next-js
