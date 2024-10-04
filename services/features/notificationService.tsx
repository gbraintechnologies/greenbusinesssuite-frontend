import defaultMeshApi from "../defaultMeshClient";

// send notifications
export const sendEmail = () => {
  return () =>
    defaultMeshApi.get(`/notifications/email/push`).then((res) => res.data);
};

// retrieve messages
export const allPastNotifications = (page: number = 0, size: number = 10) => {
  return () =>
    defaultMeshApi
      .get(`/notifications/all-messages/${page}/${size}`)
      .then((res) => res.data);
};

// retrieve messages by id
export const getNotificationById = (id: number) => {
  return () =>
    defaultMeshApi.get(`/notifications/${id}`).then((res) => res.data);
}
