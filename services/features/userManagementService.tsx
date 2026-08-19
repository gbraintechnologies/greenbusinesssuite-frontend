import { CustomField } from "@/types";
import authApi from "../axiosAuthClient";
import meshAuthApi from "../meshAuthClient";

export function asUserList(data: unknown): any[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray((data as any)?.content)) return (data as any).content;
  if (Array.isArray((data as any)?.users)) return (data as any).users;
  if (Array.isArray((data as any)?.data)) return (data as any).data;
  return [];
}

export function userCompanyIdentifier(user: any): string {
  return String(
    user?.companyIdentifier ??
      user?.company_identifier ??
      user?.tenantId ??
      user?.tenantid ??
      user?.tenant_id ??
      ""
  )
    .trim()
    .toLowerCase();
}

export function filterUsersByCompany(
  users: unknown,
  companyIdentifier: string
) {
  const target = String(companyIdentifier ?? "")
    .trim()
    .toLowerCase();
  if (!target) return [];
  return asUserList(users).filter(
    (user) => userCompanyIdentifier(user) === target
  );
}

export const allUsers = (offset: number = 0, limit: number = 20) => {
  return () => authApi.get(`/users`).then((res) => res.data);
};

export const allUsersRaw = (offset: number = 0, limit: number = 20) => {
  return authApi.get(`/users`).then((res) => res.data);
};

/** Company-admin list: GET /users then keep only this tenant's users */
export const getCompanyUsers = (companyIdentifier: string) => {
  return () =>
    meshAuthApi
      .get(`/users`)
      .then((res) => filterUsersByCompany(res.data, companyIdentifier));
};

export const userByID = (id: any) => {
  return () => authApi.get(`/users/${id}`).then((res) => res.data);
};

export const userByIDRaw = (id: any) => {
  return authApi.get(`/users/${id}`).then((res) => res.data);
};

export const searchUsers = (filter_word: any, companyIdentifier?: string) => {
  return () =>
    authApi.get(`/users/search_users/${filter_word}`).then((res) => {
      if (!companyIdentifier) return res.data;
      return filterUsersByCompany(res.data, companyIdentifier);
    });
};

export const searchUsersByEmailFull = (email: string) => {
  return () => authApi.get(`/users/search_users_by_email/${email}`);
};

export const searchUsersByEmail = (email: string) => {
  return authApi.get(`/users/search_users_by_email/${email}`);
};

export const allUsersByRole = (role_id: any, role_name: any) => {
  return authApi.get(`/users/byrole/${role_id}?role_name=${role_name}`);
};

export const createUser = (data: any) => {
  return authApi.post("/auth/sign-up", data);
};

export const blacklistUser = (userId: string) => {
  return authApi.post("/users/blacklist/" + userId);
};

export const createUserWithCustomProfiles = (
  data: any,
  custom_profiles: any
) => {
  return authApi.post("/users/create_with_custom_fields/", {
    user_data: data,
    custom_profiles,
  });
};

export const editUserWithCustomProfiles = (
  id: any,
  data: any,
  custom_profiles: any
) => {
  if (id) {
    return authApi.put("/users/edit_with_custom_fields/" + id, {
      user_data: data,
      custom_profiles,
    });
  } else {
    throw new Error("User ID is required");
  }
};

export const editUserWithCustomFields = (
  data: any,
  custom_fields: CustomField[],
  userId: string
) => {
  return authApi.put(`users/edit_with_custom_fields/${userId}`, {
    user_data: data,
    custom_profiles: custom_fields,
  });
};

// CUSTOM FIELDS

export const createCustomField = (name: any) => {
  return authApi.post("/users/create_custom_field", {
    item_key: name.toLowerCase().replaceAll(" ", "_"),
    item_label: name.toLowerCase().replaceAll(" ", "_"),
  });
};

export const createCustomFieldValue = (
  user_id: any,
  custom_profile_item_id: any,
  value: any
) => {
  return authApi.post("/users/create_custom_field_value", {
    user_id,
    custom_profile_item_id,
    value,
  });
};

export const allCustomFields = () => {
  return () =>
    authApi.post("/users/get_custom_fields/").then((res) => res.data);
};

export const getLoggedInUser = () => {
  return () => authApi.get(`/users/me`).then((res) => res.data);
};

export const getLoggedInUserAuthorities = () => {
  return () => authApi.get(`/users/authorities`).then((res) => res.data);
};

export const deleteUser = (id: string | number) => {
  return authApi.delete(`/users/${id}`);
};

export const updateUserStatus = (id: string | number, status: string) => {
  return authApi.put(`/users/${id}/status`, { status });
};

export const updateUserCompanyIdentifier = (
  id: string | number,
  companyIdentifier: string
) => {
  return authApi.put(`/users/${id}/company-identifier`, { companyIdentifier });
};

export const updateUserPassword = (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  return authApi.put(`/users/change-password`, data);
};
