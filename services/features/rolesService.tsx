import authApi from "../axiosAuthClient";

export const getMeshBusinessSuiteRoles = (id: any) => {
  return () => authApi.get(`/apps/roles_by_app/${id}`).then((res) => res.data);
};

export const createRole = ({ name, description }: any) => {
  return authApi.post("/apps/roles/create", {
    role_name: name,
    app_id: 1,
    role_description: description,
    is_support: true,
    is_admin_role: true,
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

export const RoleByID = (RoleID: number) => {
  return () => authApi.get(`/apps/roles/${RoleID}`).then((res) => res.data);
};
