import axios, { AxiosInstance } from "axios";
import { getRefreshToken, getTenantID, getUserUUID, setAuth } from "./localService";

export const attachRefreshInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (!error.response) return Promise.reject(error);

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/mesh-suite/v1.0/auth/refresh-token`,
            {
              refreshToken: getRefreshToken(),
            },
            {
              headers: {
                "Content-Type": "application/json",
                "user-uuid": getUserUUID(),
                ...(getTenantID() ? { tenantid: getTenantID() } : {}),
              },
            }
          );

          setAuth(res.data.accessToken, res.data.refreshToken);

          originalRequest.headers["Authorization"] = `Bearer ${res.data.accessToken}`;
          return instance(originalRequest);

        } catch (refreshError) {
          window.dispatchEvent(new Event("sessionExpired"));
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};