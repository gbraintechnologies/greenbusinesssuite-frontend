import { meshBaseURL } from "@/lib/api";
import { headerT } from "@/types/headerType";
import axios from "axios";
import { getTenantID } from "./localService";

export const noAuthApi = axios.create({
  baseURL: meshBaseURL,
});

// REQUEST INTERCEPTOR
noAuthApi.interceptors.request.use(
  // @ts-ignore
  (config) => {
    let headers: headerT = {
      "Content-Type": "application/json",
      accept: "application/json",
    };

    // Use tenantId if presentxsssss
    return {
      ...config,
      headers: Boolean(getTenantID)
        ? { ...headers, tenantid: getTenantID() }
        : headers,
    };
  },
  (error) => Promise.reject(error),
);

export default noAuthApi;
