import authApi from "../axiosAuthClient";

export const getMeshBusinessSuiteRoles = () => {
  return () => authApi.get(`/roles/permission/all`).then((res) => res.data);
};

export const getLoggedInUserPermissions = () => {
  return () =>
    authApi.get(`/users/me/permissions`).then((res) => res.data);
};

export const createRole = ({ name, description }: any) => {
  return authApi.post("/roles/permission/create", {
    roleName: name,
    description: description,
    permissions: [
      {
        id: 25,
        name: "user:read",
        module: "user",
        action: "read",
        subModule: null,
      },
    ],
  });
};

export const EditRole = ({ id, name, description, permissions }: any) => {
  return authApi.put(`/roles/${id}`, {
    roleName: name,
    description: description,
    permissions: permissions ?? [],
  });
};

export const updateRole = (id: number | string, data: unknown) => {
  return authApi.put(`/roles/${id}`, data);
};

export const deleteRole = (roleId: number | string) => {
  return authApi.delete(`/roles/${roleId}`);
};

export const getRoleNames = () => {
  return () => authApi.get(`/roles/role-names`).then((res) => res.data);
};

export const assignRoleToUser = (userID: any, roleID: any) => {
  return authApi.put(`/users/${userID}/role/${roleID}`);
};

export const updateUserRole = (userID: any, roleID: any) => {
  return authApi.put(`/users/${userID}/role/${roleID}`);
};

export const allUserRoles = (limit: number = 100) => {
  return () =>
    authApi.get(`/apps/all_roles/?limit=${limit}`).then((res) => res.data);
};

export const getRoleById = (id: number) => {
  return () =>
    authApi.get(`/roles/permission-by-id/${id}`).then((res) => res.data);
};
