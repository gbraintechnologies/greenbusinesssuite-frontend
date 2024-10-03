import defaultMeshApi from "../defaultMeshClient";

// send notifications
export const sendEmail = () => {
  return () =>
    defaultMeshApi.get(`/notifications/email/push`).then((res) => res.data);
};

// retrieve messages

export const allPastNotifications = () => {
  return () =>
    defaultMeshApi
      .get(`/notifications/all-messages/0/100`)
      .then((res) => res.data);
};
