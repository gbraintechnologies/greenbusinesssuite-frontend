import authApi from "../axiosAuthClient";

export const getMeshBusinessSuiteRoles = (id: any) => {
  return () => authApi.get(`/apps/roles_by_app/${id}`).then((res) => res.data);
};

export const createRole = ({ name, description }: any) => {
  return authApi.post("/apps/roles/create", {
    role_name: name,
    app_id: 1,
    role_description: description,
  });
};

export const assignRoleToUser = (userID: any, roleID: any) => {
  return authApi.post("/users/create_user_profile", {
    user_id: userID,
    app_id: 1,
    role_id: roleID,
  });
};
