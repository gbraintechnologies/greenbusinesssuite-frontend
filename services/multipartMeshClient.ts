import axios from "axios";

import { getToken, getRefreshToken } from "./localService";

import { toast } from "sonner";

const multipartMeshApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/mesh-suite/v1.0`,
});

// REQUEST INTERCEPTOR
multipartMeshApi.interceptors.request.use(
  // @ts-ignore
  (config) => {
    return {
      ...config,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${getToken()}`,
      },
    };
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR: listen for a 401 or 403 then refresh token
multipartMeshApi.interceptors.response.use(
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
          `https://api-mesh-suite-staging.meshapps.io/userapps/v1.0/users/refresh_token/?token=${getRefreshToken()}`,
          {
            "Content-Type": "application/json",
          }
        )
        .then((res) => {
          const oldRefreshToken = getRefreshToken();

          localStorage.setItem(
            "auth",
            JSON.stringify({
              access_token: res?.data?.access_token,
              refresh_token: oldRefreshToken,
            })
          );

          // return
          return axios({
            ...originalRequest,
            headers: {
              // USE NEW TOKEN IN RETRY REQUEST
              Authorization: `Bearer ${res?.data?.access_token}`,
            },
          });
        })
        .catch((e) => {
          // TODO: HANDLE LOGIC HERE TO GO TO RIGHT LOGIN SCREEN
          // TO COMPANY OR TO LOGICIEL ADMIN
          toast.dismiss();
          toast.warning("Login to continue", {
            description: "Your session has expired. Please login to continue",
          });
          // @ts-ignore
          localStorage.clear();
          window.location.replace("/");
          window.location.reload();
        });
    }

    return Promise.reject(error);
  }
);

export default multipartMeshApi;
