import defaultMeshApi from "../defaultMeshClient";

// send notifications
export const sendEmail = () => {
  return defaultMeshApi.post(`/notifications/email/push`);
};

// retrieve messages

export const allPastNotifications = () => {
  return () =>
    defaultMeshApi
      .get(`/notifications/all-messages/0/100`)
      .then((res) => res.data);
};
