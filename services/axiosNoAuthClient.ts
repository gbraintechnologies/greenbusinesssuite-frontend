import axios from "axios";

const noAuthApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/userapps/v1.0`,
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
