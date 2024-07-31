import axios from "axios";

import { headerT } from "@/types/headerType";
import { getTenantID } from "./localService";

const tenantNoAuthClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/userapps/v1.0`,
});

// REQUEST INTERCEPTOR
tenantNoAuthClient.interceptors.request.use(
  // @ts-ignore
  (config) => {
    let headers: headerT = {
      "Content-Type": "application/json",
      tenantid: getTenantID(),
    };

    return {
      ...config,
      headers: headers,
    };
  },
  (error) => Promise.reject(error)
);

export default tenantNoAuthClient;
