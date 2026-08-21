import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import {
  getRefreshToken,
  getTenantID,
  getUserUUID,
  setAuth,
} from "./localService";

type RetriableRequest = InternalAxiosRequestConfig & { _retry?: boolean };

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/mesh-suite/v1.0/auth/refresh-token`,
    { refreshToken },
    {
      headers: {
        "Content-Type": "application/json",
        "user-uuid": getUserUUID(),
        ...(getTenantID() ? { tenantid: getTenantID() } : {}),
      },
    }
  );

  const accessToken = res.data?.accessToken;
  const nextRefreshToken = res.data?.refreshToken ?? refreshToken;

  if (!accessToken) {
    throw new Error("Refresh response missing accessToken");
  }

  setAuth(accessToken, nextRefreshToken);
  return accessToken;
}

function getSharedRefresh(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

export const attachRefreshInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetriableRequest | undefined;

      if (!error.response || !originalRequest) {
        return Promise.reject(error);
      }

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const accessToken = await getSharedRefresh();
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return instance(originalRequest);
        } catch (refreshError) {
          if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("sessionExpired"));
          }
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};
