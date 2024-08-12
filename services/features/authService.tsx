import noAuthApi from "../axiosNoAuthClient";
import authApi from "../axiosAuthClient";
import noAuthApi2 from "../axiosNoAuthClient2";

export const login = (username: any, password: any) => {
  var formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);

  return noAuthApi.post("/users/login_for_token", formData);
};

export const currentLoggedIn = (token: any) => {
  return authApi.post(`/users/current_logged_in/?token=${token}`);
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

// STEP 1
export const attemptPasswordReset = (email: any) => {
  return noAuthApi.post("/users/noauth/attempt_password_reset/", {
    user_email: email,
  });
};

// STEP 2
export const verifyResetAttempt = (code: string) => {
  return noAuthApi
    .get("/users/noauth/verify_password_reset/" + code)
    .then((res) => res.data);
};

// STEP 3
export const resetPassword = (
  userId: string | number,
  resetCode: string,
  userEmail: string,
  newPassword: string
) => {
  return noAuthApi
    .post("/users/noauth/reset_password/", {
      user_id: userId,
      user_email: userEmail,
      reset_code: resetCode,
      new_password: newPassword,
      otp_value: null,
    })
    .then((res) => res.data);
};

export const notifyUserTempCred = (id: any, channel: string) => {
  return noAuthApi2.post("/users/noauth/notify_user_temp_cred/", {
    user_id: id,
    channel: channel,
  });
};

export const userSelfSignUp = (data: any) => {
  return noAuthApi2.post("/users/self_create_account/", {
    user_data: data,
    role_data: {
      app_id: 1,
      role_id: 6,
    },
  });
};

export const confirmAccount = (token: any) => {
  return noAuthApi2.put(`/users/confirm_account/${token}`);
};
