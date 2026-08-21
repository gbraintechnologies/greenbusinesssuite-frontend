import axios from "axios";
import {
  getSessionTenantID,
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
    const isFormData =
      typeof FormData !== "undefined" && config.data instanceof FormData;

    const headers: headerT = {
      // FormData must not force application/json (breaks multipart boundary)
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      "user-uuid": getUserUUID(),
      Authorization: `Bearer ${getToken()}`,
      tenantid: getSessionTenantID() || getTenantID(),
    };

    return { ...config, headers };
  },
  (error: unknown) => Promise.reject(error),
);

// RESPONSE INTERCEPTOR: handles 401 token refresh and retry
attachRefreshInterceptor(authApi);

export default authApi;