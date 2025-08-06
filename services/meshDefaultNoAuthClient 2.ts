import axios from "axios";
import { headerT } from "@/types/headerType";

const noAuthApi = axios.create({
  // baseURL: `${process.env.NEXT_PUBLIC_API_URL}/mesh-suite/v1.0`,
  baseURL: "https://api-staging.meshsuites.com/mesh-suite/v1.0",
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
  (error) => Promise.reject(error)
);

export default noAuthApi;
