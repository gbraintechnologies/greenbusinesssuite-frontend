import authApi from "../meshAuthClient";

export const allForms = () => {
  return () => authApi.get("/forms/all").then((res) => res.data);
};

export const createNewForm = (data: any) => {
  return authApi.post("/forms/create", data);
};
