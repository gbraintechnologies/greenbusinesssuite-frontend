import { meshBaseURL } from "@/lib/api";
import axios from "axios";
import {
  getPublicTenantID,
  getSessionTenantID,
  getTenantID,
} from "./localService";

export const noAuthApi = axios.create({
  baseURL: meshBaseURL,
});

// REQUEST INTERCEPTOR
noAuthApi.interceptors.request.use(
  (config) => {
    config.headers.set("accept", "application/json");
    if (!config.headers.get("Content-Type")) {
      config.headers.set("Content-Type", "application/json");
    }

    // Public pages (e.g. survey links) have no stored auth, so fall back to the
    // tenant from the link. Never let a leftover admin session tenant override
    // an explicit tenantid header on the request.
    if (!config.headers.get("tenantid") && !config.headers.get("Tenantid")) {
      const tenantId =
        getPublicTenantID() ?? getSessionTenantID() ?? getTenantID();
      if (tenantId) {
        config.headers.set("tenantid", tenantId);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default noAuthApi;
