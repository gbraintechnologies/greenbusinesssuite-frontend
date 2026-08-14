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
    config.headers.set("Authorization", `Bearer ${getToken()}`);
    config.headers.set("user-uuid", getUserUUID());

    const existingTenant =
      config.headers.get("tenantid") || config.headers.get("Tenantid");
    const tenant = existingTenant || getTenantID() || getSessionTenantID();
    if (tenant) {
      config.headers.set("tenantid", String(tenant));
    }

    // FormData must keep the browser-generated multipart boundary.
    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
      config.headers.delete("Content-Type");
      config.headers.delete("content-type");
    }

    return config;
  },
  (error) => Promise.reject(error)
);

attachRefreshInterceptor(multipartMeshApi);

export default multipartMeshApi;
