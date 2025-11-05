import axios from "axios";

import {
  getToken,
  getRefreshToken,
  getUserUUID,
  getCompanyID,
  getUserId,
  getTenantID,
} from "./localService";

import { headerT } from "@/types/headerType";

const authApi = axios.create({
  // baseURL: `${process.env.NEXT_PUBLIC_API_URL}/mesh-suite/v1.0`,
  baseURL: `https://api-staging.meshsuites.com/mesh-suite/v1.0`,
});

// REQUEST INTERCEPTOR
authApi.interceptors.request.use(
  // @ts-ignore
  (config) => {
    let headers: headerT = {
      "Content-Type": "application/json",
      "user-uuid": getUserUUID(),
      Authorization: `Bearer ${getToken()}`,
    };

    // Route to admin or tenant
    if (getCompanyID() !== 0) {
      headers = { ...headers, tenantid: getTenantID() };
    }

    return {
      ...config,
      headers: headers,
    };
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR: listen for a 401 or 403 then refresh token
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      console.log("refrsh token");
      originalRequest._retry = true;

      let headers: headerT = {
        "Content-Type": "application/json",
        "user-uuid": getUserUUID(),
        // Authorization: `Bearer ${getToken()}`,
      };

      // Route to admin or tenant
      if (getCompanyID() !== 0) {
        headers = { ...headers, tenantid: getTenantID() };
      }

      const config = {
        headers: {
          ...headers,
        },
      };

      //  GET REFRESH TOKEN AND RETRY REQUEST
      axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/mesh-suite/v1.0/auth/refresh-token`,
          {
            refreshToken: getRefreshToken(),
          },
          config
        )
        .then((res) => {
          const oldRefreshToken = getRefreshToken();
          const uuid = getUserUUID();
          const companyId = getCompanyID();
          const userId = getUserId();

          localStorage.setItem(
            "auth",
            JSON.stringify({
              accessToken: res?.data?.accessToken,
              company_id: companyId,
              refreshToken: res?.data?.refreshToken,
              user_id: userId,
              id: uuid,
            })
          );

          // return
          return axios({
            ...originalRequest,
            headers: {
              // USE NEW TOKEN IN RETRY REQUEST
              ...headers,
              Authorization: `Bearer ${res?.data?.accessToken}`,
            },
          });
        })
        .catch((e) => {
          window.dispatchEvent(new Event("sessionExpired"));
        });
    }

    return Promise.reject(error);
  }
);

export default authApi;
