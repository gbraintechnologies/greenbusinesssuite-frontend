import React, { createContext, useEffect, useState } from "react";

// @ts-ignore
export const UserContext = createContext();

// @ts-ignore
const UserFromLS =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("user") || null)
    : null;

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(UserFromLS);

  const addUserData = (data) => {
    setUser((prev) => ({ ...prev, ...data }));
  };

  const removeUser = () => {
    setUser(null);
  };

  useEffect(() => {
    //
    localStorage.setItem("user", JSON.stringify(user));

    //TODO: temporary hack to solve admin and user separation
    localStorage.setItem("admin", JSON.stringify(user));
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        addUserData,
        removeUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// ls undefinied in next: https://stackoverflow.com/questions/73853069/solve-referenceerror-localstorage-is-not-defined-in-next-js
