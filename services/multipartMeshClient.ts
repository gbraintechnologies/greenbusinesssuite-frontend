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

const multipartMeshApi = axios.create({
  baseURL: meshBaseURL,
});

// REQUEST INTERCEPTOR
multipartMeshApi.interceptors.request.use(
  // @ts-ignore
  (config) => {
    let headers: headerT = {
      "Content-Type": "multipart/form-data",
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
attachRefreshInterceptor(multipartMeshApi);

export default multipartMeshApi;