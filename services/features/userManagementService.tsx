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
