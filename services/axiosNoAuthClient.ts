import { meshBaseURL } from "@/lib/api";
import { headerT } from "@/types/headerType";
import axios from "axios";
import { getSessionTenantID } from "./localService";

const noAuthApi = axios.create({
  baseURL: meshBaseURL,
});

// REQUEST INTERCEPTOR
noAuthApi.interceptors.request.use(
  // @ts-ignore
  (config) => {
    let headers: headerT = {
      "Content-Type": "application/json",
      accept: "*/*",
    };

    // Use tenantId if presentssss
    return {
      ...config,
      headers: Boolean(getSessionTenantID())
        ? { ...headers, tenantid: getSessionTenantID() }
        : headers,
    };
  },
  (error) => Promise.reject(error),
);

export default noAuthApi;
