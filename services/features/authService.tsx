import api from "../axiosNoAuthClient";

export const login = (username: any, password: any) => {
  var formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);

  return api.post("/users/login_for_token", formData);
};

export const setPassword = ({
  user_id,
  current_password,
  new_password,
}: any) => {
  return api.post("/users/set_password", {
    user_id,
    current_password,
    new_password,
  });
};

export const attemptPasswordReset = (email: any) => {
  return api.post("/users/noauth/attempt_password_reset/", {
    user_email: email,
  });
};
