import axios from "axios";

import { getToken, getRefreshToken } from "./localService";

const api = axios.create({
  baseURL: "https://api-mesh-suite-staging.meshapps.io/userapps/v1.0",
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  // @ts-ignore
  (config) => {
    return {
      ...config,
      headers: {
        token: getToken(),
      },
    };
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR: listen for a 401 or 403 then refresh token
api.interceptors.response.use(
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
    }

    return Promise.reject(error);
  }
);

export default api;
