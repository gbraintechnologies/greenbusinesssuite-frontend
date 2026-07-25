import defaultMeshApi from "../defaultMeshClient";
import authApi from "../meshAuthClient";
import noAuthApi from "../meshNoAuthClient";
import multipartMeshApi from "../multipartMeshClient";
import authNoTenantApi from "../meshAuthNoTenantClient"

// send notifications
export const sendEmail = (data: any) => {
  return authApi.post(`/notifications/email/push`, data);
};

export const notifyClientForDocumentIssued = (data: any) => {
  return authApi.post(`/notifications/send-document-issuance`, data);
};

export const notifyCompanyAdminOfFormCompletion = (
  userId: string,
  formId: number
) => {
  return authApi.post(
    `/notifications/form-response-email/${userId}/${formId}/true`
  );
};

export const sendEmailWithFile = (data: any, file: any) => {
  const formData = new FormData();

  formData.append("email", JSON.stringify(data));
  formData.append("attachment", file);

  return multipartMeshApi.post(`/notifications/attach-email/push`, formData);
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

// retrieve recurring messages by type
export const getRecurringMessagesByType = (
  type: string,
  page: number = 0,
  size: number = 10
) => {
  return () =>
    authApi
      .get(`/notifications/messages-by-type/${page}/${size}/${type}`)
      .then((res) => res.data);
};

// update recurring type
export const updateRecurringMessageType = async (
  id: number | string,
  recurringType: string
) => {
  return await authApi
    .put(`/notifications/notify-change/${id}/${recurringType}`)
    .then((res) => res.data);
};

export const sendFormEmailNotification = async (
  userId: string | number,
  companyId: string | number,
  formId: string | number
) => {
  return await authNoTenantApi
    .post(`/notifications/form-submit-email`, {
      userId: userId,
      companyId: companyId,
      formId: formId,
    })
    .then((res) => res.data);
};

export const deleteNotification = (id: number | string) => {
  return authApi.delete(`/notifications/delete/${id}`);
};

export const deleteNotificationsBatch = (ids: number[]) => {
  return authApi.delete(`/notifications/delete/batch`, { data: ids });
};
