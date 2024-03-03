import authApi from "../axiosAuthClient";

export const allUsers = () => {
  return () => authApi.get("/users/all_users/").then((res) => res.data);
};

export const searchUsers = (filter_word: any) => {
  return () =>
    authApi.get(`/users/search_users/${filter_word}`).then((res) => res.data);
};

export const createUser = (data: any) => {
  return authApi.post("/users/create", data);
};

export const createUserWithCustomProfiles = (
  data: any,
  custom_profiles: any
) => {
  console.log("creating user with", { user_data: data, custom_profiles });
  return authApi.post("/users/create_with_custom_fields/", {
    user_data: data,
    custom_profiles,
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
