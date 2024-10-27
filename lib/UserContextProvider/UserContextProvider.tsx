"use client";

import { UserProvider } from "@/contexts/UserContext";

const UserContextProvider = ({ children }: any) => {
  return <UserProvider>{children}</UserProvider>;
};

export default UserContextProvider;
