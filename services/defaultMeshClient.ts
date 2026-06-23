import axios from "axios";
import { getToken } from "./localService";
import { meshBaseURL } from "@/lib/api";
import { headerT } from "@/types/headerType";
import { attachRefreshInterceptor } from "./tokenRefresh";

const defaultMeshApi = axios.create({
  baseURL: meshBaseURL,
});

// REQUEST INTERCEPTOR
defaultMeshApi.interceptors.request.use(
  // @ts-ignore
  (config) => {
    const headers: headerT = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    };

    return { ...config, headers };
  },
  (error) => Promise.reject(error),
);

// RESPONSE INTERCEPTOR: handles 401 token refresh and retry
attachRefreshInterceptor(defaultMeshApi);

export default defaultMeshApi;