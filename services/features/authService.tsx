import noAuthApi from "../axiosNoAuthClient";
import authApi from "../axiosAuthClient";

export const login = (username: any, password: any) => {
  var formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);

  return noAuthApi.post("/users/login_for_token", formData);
};

export const getNewToken = (token: any) => {
  return authApi.post(`/users/refresh_token/?token={token}`, {
    token,
  });
};

export const currentLoggedIn = (token: any) => {
  return noAuthApi.post(`/users/current_logged_in/?token=${token}`);
};

export const setPassword = ({
  user_id,
  current_password,
  new_password,
}: any) => {
  return authApi.post("/users/set_password", {
    user_id,
    current_password,
    new_password,
  });
};

export const attemptPasswordReset = (email: any) => {
  return noAuthApi.post("/users/noauth/attempt_password_reset/", {
    user_email: email,
  });
};
