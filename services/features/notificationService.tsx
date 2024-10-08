import defaultMeshApi from "../defaultMeshClient";
import authApi from "../meshAuthClient";

// send notifications
export const sendEmail = (data: any) => {
  return authApi.post(`/notifications/email/push`, data);
};

export const sendSMS = (data: any) => {
  return authApi.post(`/notifications/sms/push`, data);
};

// retrieve messages

export const allPastNotifications = (page: number = 0, size: number = 10) => {
  return () =>
    authApi
      .get(`/notifications/all-messages/${page}/${size}`)
      .then((res) => res.data);
};

// retrieve recurring messages
export const allRecurringNotifications = (
  page: number = 0,
  size: number = 10
) => {
  return () =>
    authApi
      .get(`/notifications/recurring-messages/${page}/${size}`)
      .then((res) => res.data);
};

// retrieve messages by id
export const getNotificationById = (id: number) => {
  return () => authApi.get(`/notifications/${id}`).then((res) => res.data);
};
