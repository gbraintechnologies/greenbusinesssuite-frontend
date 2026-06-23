export const getToken = () => {
  if (typeof window !== "undefined") {
    const auth = window.localStorage.getItem("auth");
    return auth ? JSON.parse(auth)?.accessToken : null;
  }
  return null;
};

export const getUserId = () => {
  if (typeof window !== "undefined") {
    const auth = window.localStorage.getItem("auth");
    return auth ? JSON.parse(auth)?.user_id : null;
  }
  return null;
};

export const getCompanyID = () => {
  if (typeof window !== "undefined") {
    const auth = window.localStorage.getItem("auth");
    return auth ? JSON.parse(auth)?.company_id : null;
  }
  return null;
};

export const getTenantID = () => {
  if (typeof window !== "undefined") {
    const auth = window.localStorage.getItem("auth");
    return auth ? JSON.parse(auth)?.tenantId : null;
  }
  return null;
};

export const getSessionTenantID = () => {
  if (typeof window !== "undefined") {
    const auth = window.sessionStorage.getItem("company-branding");
    return auth ? JSON.parse(auth)?.company_identifier : null;
  }
  return null;
};

export const getUserUUID = () => {
  if (typeof window !== "undefined") {
    const auth = window.localStorage.getItem("auth");
    return auth ? JSON.parse(auth)?.id : null;
  }
  return null;
};

export const getRefreshToken = () => {
  if (typeof window !== "undefined") {
    const auth = window.localStorage.getItem("auth");
    return auth ? JSON.parse(auth)?.refreshToken : null;
  }
  return null;
};

export const setAuth = (accessToken: string, refreshToken: string) => {
  if (typeof window !== "undefined") {
    const existing = JSON.parse(window.localStorage.getItem("auth") || "{}");
    window.localStorage.setItem(
      "auth",
      JSON.stringify({
        ...existing,
        accessToken,
        refreshToken,
      })
    );
  }
};

export const setSessionStorage = (key: any, value: any) => {
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  }
};

export const getSessionStorage = (key: any) => {
  if (typeof window !== "undefined") {
    const value = window.sessionStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }
  return null;
};