import authApi from "../axiosAuthClient";

export const allPermissions = (limit: number = 400, offset: number = 0) => {
  return () => authApi.get(`/roles/permission/all`).then((res) => res.data);
};

export const updateMultiPermissionForRole = (
  payload: { permission_ids: number[] },
  roleID: number,
) => {
  return authApi.post(
    `/apps/permissions/update_multi_permissions_for_role/${roleID}`,
    payload,
  );
};
