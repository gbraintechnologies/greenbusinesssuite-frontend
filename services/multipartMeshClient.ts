import axios from "axios";
import {
  getSessionTenantID,
  getTenantID,
  getToken,
  getUserUUID,
} from "./localService";
import { meshBaseURL } from "@/lib/api";
import { attachRefreshInterceptor } from "./tokenRefresh";

const multipartMeshApi = axios.create({
  baseURL: meshBaseURL,
});

multipartMeshApi.interceptors.request.use(
  (config) => {
    config.headers = config.headers || {};
    config.headers["Authorization"] = `Bearer ${getToken()}`;
    config.headers["user-uuid"] = getUserUUID();

    const existingTenant = config.headers["tenantid"] || config.headers["Tenantid"];
    const tenant = existingTenant || getTenantID() || getSessionTenantID();
    if (tenant) {
      config.headers["tenantid"] = tenant;
    }

    // FormData must keep the browser-generated multipart boundary.
    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
      delete config.headers["Content-Type"];
      delete config.headers["content-type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

attachRefreshInterceptor(multipartMeshApi);

export default multipartMeshApi;
