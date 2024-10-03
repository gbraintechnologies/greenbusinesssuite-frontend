import defaultMeshApi from "../defaultMeshClient";

export const allPastNotifications = () => {
  return () =>
    defaultMeshApi
      .get(`/notifications/all-messages/0/100`)
      .then((res) => res.data);
};
