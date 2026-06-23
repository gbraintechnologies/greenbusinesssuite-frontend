import axios from "axios";
import { getToken } from "./localService";
import { meshBaseURL } from "@/lib/api";
import { headerT } from "@/types/headerType";
import { attachRefreshInterceptor } from "./tokenRefresh";

const multipartDefaultMeshApi = axios.create({
  baseURL: meshBaseURL,
});

// REQUEST INTERCEPTOR
multipartDefaultMeshApi.interceptors.request.use(
  // @ts-ignore
  (config) => {
    const headers: headerT = {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${getToken()}`,
    };

    return { ...config, headers };
  },
  (error) => Promise.reject(error),
);

// RESPONSE INTERCEPTOR: handles 401 token refresh and retry
attachRefreshInterceptor(multipartDefaultMeshApi);

export default multipartDefaultMeshApi;