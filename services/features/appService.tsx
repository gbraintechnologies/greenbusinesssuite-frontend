import axios from "axios";
import authApi from "../axiosAuthClient";
import { getRefreshToken } from "../localService";

export const allApps = () => {
  return () => authApi.get("/apps/all_apps/").then((res) => res.data);
};

export const refreshToken = () => {
  axios
    .post(
      `https://api-mesh-suite-staging.meshapps.io/userapps/v1.0/users/refresh_token/?token=${getRefreshToken()}`,
      {
        "Content-Type": "application/json",
      }
    )
    .then((res) => {
      const oldRefreshToken = getRefreshToken();

      localStorage.setItem(
        "auth",
        JSON.stringify({
          access_token: res?.data?.access_token,
          refresh_token: oldRefreshToken,
        })
      );

      // return
      // return axios({
      //   ...originalRequest,
      //   headers: {
      //     Authorization: `Bearer ${res?.data?.access_token}`,
      //   },
      // });
    })
    .catch((e) => {
      // @ts-ignore
      localStorage.clear();
      window.location.replace("/");
      window.location.reload();
    });
};

export const allPermissions = (limit: number = 400, offset: number = 0) => {
  return () => authApi.get(`/roles/permission/all`).then((res) => res.data);
};

export const updateMultiPermissionForRole = (
  payload: { permission_ids: number[] },
  roleID: number
) => {
  return authApi.post(
    `/apps/permissions/update_multi_permissions_for_role/${roleID}`,
    payload
  );
};
