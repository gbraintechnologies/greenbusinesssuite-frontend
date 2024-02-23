import axios from "axios";

const noAuthApi = axios.create({
  baseURL: "https://api-mesh-suite-staging.meshapps.io/userapps/v1.0",
});

// REQUEST INTERCEPTOR
noAuthApi.interceptors.request.use(
  // @ts-ignore
  (config) => {
    return {
      ...config,
    };
  },
  (error) => Promise.reject(error)
);

export default noAuthApi;
