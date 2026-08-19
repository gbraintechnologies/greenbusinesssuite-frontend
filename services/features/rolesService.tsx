import authApi from "../axiosAuthClient";

function normalizeRolesPayload(data: unknown) {
  const list = Array.isArray(data)
    ? data
    : Array.isArray((data as any)?.content)
      ? (data as any).content
      : Array.isArray((data as any)?.data)
        ? (data as any).data
        : Array.isArray((data as any)?.roles)
          ? (data as any).roles
          : [];

  return list.map((role: any) => ({
    ...role,
    id: role?.id,
    role_name: role?.role_name ?? role?.roleName ?? role?.name ?? "",
    roleName: role?.roleName ?? role?.role_name ?? role?.name ?? "",
    description: role?.description ?? "",
  }));
}

export const getMeshBusinessSuiteRoles = () => {
  return () =>
    authApi
      .get(`/roles/permission/all`)
      .then((res) => normalizeRolesPayload(res.data));
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

export function normalizePermission(permission: any) {
  if (!permission || typeof permission !== "object") return null;
  const id = permission.id ?? permission.permissionId ?? permission.permission_id;
  if (id == null) return null;
  return {
    ...permission,
    id,
    name:
      permission.name ??
      permission.permission_name ??
      permission.permissionName ??
      "",
    module: permission.module ?? permission.moduleName ?? permission.subModule ?? "",
    action: permission.action ?? "",
    description: permission.description ?? "",
  };
}

export function extractRolePermissions(role: unknown) {
  const source = (role as any)?.permissions
    ?? (role as any)?.permissionList
    ?? (role as any)?.authorities
    ?? [];
  const list = Array.isArray(source) ? source : [];
  return list
    .map(normalizePermission)
    .filter(Boolean) as Array<{
      id: number | string;
      name: string;
      module: string;
      action: string;
      description: string;
    }>;
}

/** PUT /users/{userId}/permissions — user-level permission override after create */
export const assignPermissionsToUser = (
  userId: string | number,
  permissionIds: Array<string | number>
) => {
  return authApi.put(`/users/${userId}/permissions`, { permissionIds });
};
