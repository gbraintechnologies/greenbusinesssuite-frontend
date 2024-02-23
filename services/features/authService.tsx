import api from "../axiosAuthClient";

export const user = () => {
  return () => api.get("/user").then((res) => res.data);
};
