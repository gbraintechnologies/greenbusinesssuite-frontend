import defaultMeshApi from "../defaultMeshClient";

// send notifications
export const sendEmail = (data: any) => {
  return defaultMeshApi.post(`/notifications/email/push`, data);
};

export const sendSMS = (data: any) => {
  return defaultMeshApi.post(`/notifications/sms/push`, data);
};

// retrieve messages

export const allPastNotifications = (page: number = 0, size: number = 10) => {
  return () =>
    defaultMeshApi
      .get(`/notifications/all-messages/${page}/${size}`)
      .then((res) => res.data);
};

// retrieve recurring messages
export const allRecurringNotifications = (page: number = 0, size: number = 10) => {
  return () =>
    defaultMeshApi
      .get(`/notifications/recurring-messages/${page}/${size}`)
      .then((res) => res.data);
};

// retrieve messages by id
export const getNotificationById = (id: number) => {
  return () =>
    defaultMeshApi.get(`/notifications/${id}`).then((res) => res.data);
}
