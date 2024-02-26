export const getToken = () => {
  // @ts-ignore
  let user = JSON.parse(localStorage.getItem("admin"));
  if (user !== null) {
    return user?.access_token;
  } else {
    return 0;
  }
};

export const getRefreshToken = () => {
  // @ts-ignore
  let user = JSON.parse(localStorage.getItem("admin"));
  if (user !== null) {
    return user?.refresh_token;
  } else {
    return 0;
  }
};
