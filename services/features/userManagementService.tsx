import authApi from "../axiosAuthClient";

export const allUsers = () => {
  return () => authApi.get("/users/all_users/").then((res) => res.data);
};

export const createUser = (data: any) => {
  return authApi.post("/users/create", data);
};
