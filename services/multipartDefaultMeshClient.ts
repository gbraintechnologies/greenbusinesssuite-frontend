import axios from "axios";

import {
  getToken,
  getRefreshToken,
  getUserUUID,
  getCompanyID,
  getUserId,
  getTenantID,
} from "./localService";

import { toast } from "sonner";
import { headerT } from "@/types/headerType";

const multipartDefaultMeshApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/mesh-suite/v1.0`,
});

// REQUEST INTERCEPTOR
multipartDefaultMeshApi.interceptors.request.use(
  // @ts-ignore
  (config) => {
    let headers: headerT = {
      "Content-Type": "multipart/form-data",
      // "user-uuid": getUserUUID(),
      Authorization: `Bearer ${getToken()}`,
    };

    // Route to admin or tenant
    // if (getCompanyID() !== 0) {
    //   headers = { ...headers, tenantid: getTenantID() };
    // }

    return {
      ...config,
      headers: headers,
    };
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR: listen for a 401 or 403 then refresh token
multipartDefaultMeshApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    // 403 error means the server understands but refuses to authorize because token is expired
    if (error.response.status === 401 && !originalRequest._retry) {
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
          `https://api-mesh-suite-staging.meshapps.io/userapps/v1.0/users/refresh_token/?token=${getRefreshToken()}`,
          null,
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
              access_token: res?.data?.access_token,
              company_id: companyId,
              refresh_token: oldRefreshToken,
              user_id: userId,
              user_uuid: uuid,
            })
          );

          // return
          return axios({
            ...originalRequest,
            headers: {
              // USE NEW TOKEN IN RETRY REQUEST
              ...headers,
              Authorization: `Bearer ${res?.data?.access_token}`,
            },
          });
        })
        .catch((e) => {
          toast.dismiss();
          toast.warning("Login to continue", {
            description: "Your session has expired. Please login to continue.",
          });
          // @ts-ignore
          localStorage.clear();
          if (Boolean(getTenantID())) {
            window.location.replace(`/${getTenantID()}`);
          } else {
            window.location.replace("/");
          }
          window.location.reload();
        });
    }

    return Promise.reject(error);
  }
);

export default multipartDefaultMeshApi;
