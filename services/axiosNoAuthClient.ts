import axios from "axios";
import { getTenantID } from "./localService";
import { headerT } from "@/types/headerType";

const noAuthApi = axios.create({
  // baseURL: `${process.env.NEXT_PUBLIC_API_URL}/mesh-suite/v1.0`,
  baseURL: `https://api-staging.meshsuites.com/mesh-suite/v1.0`,
});

// REQUEST INTERCEPTOR
noAuthApi.interceptors.request.use(
  // @ts-ignore
  (config) => {
    let headers: headerT = {
      "Content-Type": "application/json",
      accept: "*/*",
    };

    // Use tenantId if presentxsssss
    return {
      ...config,
      headers: Boolean(getTenantID)
        ? { ...headers, tenantid: getTenantID() }
        : headers,
    };
  },
  (error) => Promise.reject(error)
);

export default noAuthApi;
