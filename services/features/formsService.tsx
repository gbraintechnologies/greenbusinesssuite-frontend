import authApi from "../meshAuthClient";

export const allForms = () => {
  return () => authApi.get("/forms/all").then((res) => res.data);
};

export const getFormById = (id: any) => {
  return () => authApi.get(`/forms/${id}`).then((res) => res.data);
};

export const createNewForm = (data: any) => {
  return authApi.post("/forms/create", data);
};

export const deleteForm = (id: any) => {
  return authApi.delete(`/forms/delete/${id}`);
};
