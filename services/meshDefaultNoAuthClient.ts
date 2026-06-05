import { meshBaseURL } from "@/lib/api";
import { headerT } from "@/types/headerType";
import axios from "axios";

const noAuthApi = axios.create({
  baseURL: meshBaseURL,
});

// REQUEST INTERCEPTOR
noAuthApi.interceptors.request.use(
  // @ts-ignore
  (config) => {
    let headers: headerT = {
      "Content-Type": "application/x-www-form-urlencoded",
      accept: "application/json",
    };

    return {
      ...config,
      headers: headers,
    };
  },
  (error) => Promise.reject(error),
);

export default noAuthApi;
