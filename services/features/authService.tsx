import authApi from "../axiosAuthClient";
import noAuthApi from "../axiosNoAuthClient";
import { getSessionTenantID } from "../localService";

export const login = ({ username, password, tenantid }: any) => {
  return noAuthApi.post("/auth/sign-in", {
    email: username,
    password,
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

/** POST /auth/forgot-password */
export const attemptPasswordReset = (email: any) => {
  return noAuthApi.post("/auth/forgot-password", {
    email: email,
  });
};

/**
 * @deprecated Prefer resetPassword(token, newPassword). Kept for callers that
 * still expect a pre-check; Swagger has no separate verify-reset endpoint.
 */
export const verifyResetAttempt = async (_code: string) => {
  return { user: null };
};

/** POST /auth/reset-password — body: { token, newPassword } */
export const resetPassword = (
  tokenOrUserId: string | number,
  resetCodeOrNewPassword?: string,
  _userEmail?: string,
  maybeNewPassword?: string
) => {
  // New Swagger signature: resetPassword(token, newPassword)
  // Legacy signature: resetPassword(userId, resetCode, userEmail, newPassword)
  const isLegacy =
    maybeNewPassword != null ||
    (typeof tokenOrUserId === "number" && resetCodeOrNewPassword != null);

  const token = isLegacy
    ? String(resetCodeOrNewPassword)
    : String(tokenOrUserId);
  const newPassword = isLegacy
    ? String(maybeNewPassword)
    : String(resetCodeOrNewPassword);

  return noAuthApi
    .post("/auth/reset-password", {
      token,
      newPassword,
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

/** GET /auth/verify-account?email= */
export const confirmAccount = (email: string) => {
  return noAuthApi.get("/auth/verify-account", {
    params: { email },
  });
};

/** POST /auth/sign-out */
export const signOut = () => {
  return authApi.post("/auth/sign-out");
};
