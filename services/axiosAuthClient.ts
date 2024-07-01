import axios from "axios";

import { getToken, getRefreshToken } from "./localService";

import toast from "react-hot-toast";

const authApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/userapps/v1.0`,
});

// REQUEST INTERCEPTOR
authApi.interceptors.request.use(
  // @ts-ignore
  (config) => {
    return {
      ...config,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    };
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR: listen for a 401 or 403 then refresh token
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    // 403 error means the server understands but refuses to authorize because token is expired
    if (
      (error.response.status === 401 || error.response.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      //  GET REFRESH TOKEN AND RETRY REQUEST

      axios
        .post(
          `https://api-mesh-suite-staging.meshapps.io/userapps/v1.0/users/refresh_token/?token=${getRefreshToken()}`
        )
        .then((res) => {
          localStorage.setItem(
            "auth",
            JSON.stringify({
              access_token: res?.data?.access_token,
            })
          );

          // return
          return axios({
            ...originalRequest,
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          });
        })
        .catch((e) => {
          console.log("Unable to refresh token", e);
          // @ts-ignore
          localStorage.setItem("admin", null);
          // @ts-ignore
          localStorage.setItem("user", null);
          // @ts-ignore
          localStorage.setItem("auth", null);
          window.location.replace("/");
          // window.location.reload();
          toast.dismiss();
          toast.error("Please login to continue | A");
        });
    }

    return Promise.reject(error);
  }
);

export default authApi;
