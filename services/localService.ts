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
  // @ts-ignore
  let auth = JSON.parse(localStorage.getItem("auth"));
  if (auth !== null) {
    return auth?.refresh_token;
  } else {
    return "";
  }
};
