import authApi from "../axiosAuthClient";

export const getMeshBusinessSuiteRoles = () => {
  return () => authApi.get(`/roles/permission/all`).then((res) => res.data);
};

export const getLoggedInUserPermissions = () => {
  return () => authApi.get(`/users/me`).then((res) => res.data);
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

export const EditRole = ({ id, name, description }: any) => {
  return authApi.post("/apps/roles/edit", {
    id,
    role_name: name,
    app_id: 1,
    role_description: description,
    is_support: true,
    is_admin_role: true,
  });
};

export const assignRoleToUser = (userID: any, roleID: any) => {
  return authApi.post("/users/create_user_profile", {
    user_id: userID,
    app_id: 1,
    role_id: roleID,
  });
};

export const updateUserRole = (userID: any, roleID: any) => {
  return authApi.post("/users/create_user_profile", {
    user_id: userID,
    app_id: 1,
    role_id: roleID,
  });
};

export const allUserRoles = (limit: number = 100) => {
  return () =>
    authApi.get(`/apps/all_roles/?limit=${limit}`).then((res) => res.data);
};

export const getRoleById = (id: number) => {
  return () =>
    authApi.get(`/roles/permission-by-id/${id}`).then((res) => res.data);
};
