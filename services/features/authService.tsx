import noAuthApi from "../axiosNoAuthClient";
import authApi from "../axiosAuthClient";

export const login = (username: any, password: any) => {
  var formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);

  return noAuthApi.post("/users/login_for_token", formData);
};

export const currentLoggedIn = (token: any) => {
  return noAuthApi.post(`/users/current_logged_in/?token=${token}`);
};

export const changePassword = ({
  user_id,
  current_password,
  new_password,
}: any) => {
  return authApi.post("/users/change_password/", {
    user_id,
    current_password,
    new_password,
  });
};

export const updateUser = (user_id: any, userData: any) => {
  return authApi.put(`/users/update/${user_id}`, userData);
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

export const notifyUserTempCred = (id: any, channel: string) => {
  return noAuthApi.post("/users/noauth/notify_user_temp_cred/", {
    user_id: id,
    channel: channel,
  });
};
