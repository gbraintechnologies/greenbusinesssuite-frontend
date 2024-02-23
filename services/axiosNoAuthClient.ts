import axios from "axios";

const api = axios.create({
  baseURL: "https://api-mesh-suite-staging.meshapps.io/userapps/v1.0",
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  // @ts-ignore
  (config) => {
    return {
      ...config,
    };
  },
  (error) => Promise.reject(error)
);

export default api;
