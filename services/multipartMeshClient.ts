import axios from "axios";
import {
  getTenantID,
  getToken,
  getUserUUID,
} from "./localService";
import { meshBaseURL } from "@/lib/api";
import { headerT } from "@/types/headerType";
import { attachRefreshInterceptor } from "./tokenRefresh";

const multipartMeshApi = axios.create({
  baseURL: meshBaseURL,
});

// REQUEST INTERCEPTOR
multipartMeshApi.interceptors.request.use(
  // @ts-ignore
  (config) => {
    // Omit Content-Type so the runtime sets multipart/form-data; boundary=...
    const headers: headerT = {
      "user-uuid": getUserUUID(),
      Authorization: `Bearer ${getToken()}`,
      tenantid: getTenantID(),
    };

    return { ...config, headers };
  },
  (error) => Promise.reject(error),
);

// RESPONSE INTERCEPTOR: handles 401 token refresh and retry
attachRefreshInterceptor(multipartMeshApi);

export default multipartMeshApi;
