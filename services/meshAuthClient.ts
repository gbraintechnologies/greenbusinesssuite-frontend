import axios from "axios";
import {
  getSessionTenantID,
  getToken,
  getUserUUID,
} from "./localService";
import { meshBaseURL } from "@/lib/api";
import { headerT } from "@/types/headerType";
import { toast } from "sonner";
import { attachRefreshInterceptor } from "./tokenRefresh";

const authApi = axios.create({
  baseURL: meshBaseURL,
});

// REQUEST INTERCEPTOR
authApi.interceptors.request.use(
  // @ts-ignore
  (config) => {
    const headers: headerT = {
      "Content-Type": "application/json",
      "user-uuid": getUserUUID(),
      Authorization: `Bearer ${getToken()}`,
      tenantid: getSessionTenantID(),
    };

    return { ...config, headers };
  },
  (error) => Promise.reject(error),
);

// RESPONSE INTERCEPTOR: handles 401 token refresh and retry
attachRefreshInterceptor(authApi);

export default authApi;