export const getToken = () => {
  // @ts-ignore
  let user = JSON.parse(localStorage.getItem("user"));
  if (user !== null) {
    return user.accessToken;
  } else {
    return 0;
  }
};

export const getRefreshToken = () => {
  // @ts-ignore
  let user = JSON.parse(localStorage.getItem("user"));
  if (user !== null) {
    return user.accessToken;
  } else {
    return 0;
  }
};
