import authApi from "../axiosAuthClient";
import noAuthApi from "../axiosNoAuthClient";
import { getSessionTenantID } from "../localService";

export const login = ({ username, password, tenantid }: any) => {
  return noAuthApi.post("/auth/sign-in", {
    email: username,
    password,
    // tenantId: tenantid,
  });
};

export const currentLoggedIn = (token: any) => {
  return authApi.post(`/users/current_logged_in/?token=${token}`);
};

export const changePassword = (data: any) => {
  return authApi.put("/users/change-password", data);
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
  return noAuthApi.post("/auth/forgot-password", {
    email: email,
  });
};

// STEP
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
  return noAuthApi.post("/noauth/notify_user_temp_cred/", {
    user_id: id,
    channel: channel,
  });
};

export const userSelfSignUp = (data: any) => {
  return noAuthApi.post("/auth/sign-up", {
    ...data,
    tenantId: getSessionTenantID(),
  });
};

export const confirmAccount = (token: any) => {
  return noAuthApi.put(`/confirm_account/${token}`);
};
