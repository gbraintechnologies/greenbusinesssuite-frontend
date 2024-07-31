// export const getToken = () => {
//   // @ts-ignore
//   let user = JSON.parse(localStorage.getItem("auth"));
//   if (user !== null) {
//     return user?.access_token;
//   } else {
//     return 0;
//   }
// };

export const getToken = () => {
  if (typeof window !== "undefined") {
    const auth = window.localStorage.getItem("auth");
    return auth ? JSON.parse(auth)?.access_token : null;
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

export const getUserUUID = () => {
  if (typeof window !== "undefined") {
    const auth = window.localStorage.getItem("auth");
    return auth ? JSON.parse(auth)?.user_uuid : null;
  }
  return null;
};

export const getRefreshToken = () => {
  if (typeof window !== "undefined") {
    const auth = window.localStorage.getItem("auth");
    return auth ? JSON.parse(auth)?.refresh_token : null;
  }
  return null;
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
