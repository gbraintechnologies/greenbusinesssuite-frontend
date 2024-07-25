export const getToken = () => {
  // @ts-ignore
  let user = JSON.parse(localStorage.getItem("auth"));
  if (user !== null) {
    return user?.access_token;
  } else {
    return 0;
  }
};

export const getRefreshToken = () => {
  if (typeof window !== "undefined") {
    // @ts-ignore
    let auth = JSON.parse(localStorage.getItem("auth"));
    if (auth !== null) {
      return auth?.refresh_token;
    } else {
      return "";
    }
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
