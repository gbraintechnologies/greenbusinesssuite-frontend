import axios from "axios";

import { getToken, getRefreshToken } from "./localService";
import services from ".";

const authApi = axios.create({
  baseURL: "https://api-mesh-suite-staging.meshapps.io/userapps/v1.0",
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

      console.log("token expired, refresh it", getRefreshToken());
      // services
      //   .getNewToken(getRefreshToken())
      //   .then((res) => {
      //     console.log("trying to get new token", res?.data);
      //   })
      //   .catch((e) => {
      //     console.log("e", e?.response?.data?.detail);
      //   });
    }

    return Promise.reject(error);
  }
);

export default authApi;
