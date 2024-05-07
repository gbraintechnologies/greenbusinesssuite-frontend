import React, { createContext, useEffect, useState } from "react";

// @ts-ignore
export const AuthContext = createContext();

// @ts-ignore
const UserFromLS =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("auth") || null)
    : null;

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(UserFromLS);

  const addAuthData = (data) => {
    setAuth((prev) => ({ ...prev, ...data }));
  };

  const removeAuth = () => {
    setAuth(null);
  };

  useEffect(() => {
    //
    localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        addAuthData,
        removeAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ls undefinied in next: https://stackoverflow.com/questions/73853069/solve-referenceerror-localstorage-is-not-defined-in-next-js
