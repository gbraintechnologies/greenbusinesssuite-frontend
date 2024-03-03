import authApi from "../axiosAuthClient";

export const allApps = () => {
  return () => authApi.get("/apps/all_apps/").then((res) => res.data);
};
