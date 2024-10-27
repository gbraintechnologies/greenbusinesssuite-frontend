"use client";

import { AuthProvider } from "@/contexts/AuthContext";

const AuthContextProvider = ({ children }: any) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default AuthContextProvider;
