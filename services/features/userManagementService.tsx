import { CustomField } from "@/types";
import authApi from "../axiosAuthClient";

export const allUsers = (offset: number = 0, limit: number = 20) => {
  return () => authApi.get(`/users`).then((res) => res.data);
};

export const allUsersRaw = (offset: number = 0, limit: number = 20) => {
  return authApi.get(`/users`).then((res) => res.data);
};

export const userByID = (id: any) => {
  return () => authApi.get(`/users/${id}`).then((res) => res.data);
};

export const userByIDRaw = (id: any) => {
  return authApi.get(`/users/${id}`).then((res) => res.data);
};

export const searchUsers = (filter_word: any) => {
  return () =>
    authApi.get(`/users/search_users/${filter_word}`).then((res) => res.data);
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
