import noAuthApi from "../axiosNoAuthClient";
import authApi from "../axiosAuthClient";

export const login = (username: any, password: any) => {
  var formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);

  return noAuthApi.post("/users/login_for_token", formData);
};

export const currentlogged = (token: any) => {
  var formData = new FormData();
  formData.append("token", token);

  return noAuthApi.post("/users/current_logged_in", formData);
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
