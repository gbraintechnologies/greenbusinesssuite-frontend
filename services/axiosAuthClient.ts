import axios from "axios";
import {
  getCompanyID,
  getTenantID,
  getToken,
  getUserUUID,
} from "./localService";
import { meshBaseURL } from "@/lib/api";
import { headerT } from "@/types/headerType";
import { attachRefreshInterceptor } from "./tokenRefresh";

const authApi = axios.create({
  baseURL: meshBaseURL,
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

    if (getCompanyID() !== 0) {
      headers = { ...headers, tenantid: getTenantID() };
    }

    return { ...config, headers };
  },
  (error) => Promise.reject(error),
);

// RESPONSE INTERCEPTOR: handles 401 token refresh and retry
attachRefreshInterceptor(authApi);

export default authApi;