import authApi from "../meshAuthClient";
import multipartMeshApi from "../multipartMeshClient";

// send notifications
export const sendEmail = (data: any) => {
  return authApi.post(`/notifications/email/push`, data);
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

// const axios = require("axios");
// const FormData = require("form-data");
// const fs = require("fs");
// let data = new FormData();
// data.append(
//   "email",
//   '{\n  "sender": "sample",\n  "recipients": [\n    "attament@gmail.com"\n  ],\n  "subject": "dave",\n  "body": "string",\n  "isHtml": true,\n  "recurringType": "NON_RECURRING",\n  "triggerTime": "2024-10-04T12:42:55.233Z",\n  "startDate": "2024-10-04T12:42:55.234Z",\n  "endDate": "2024-10-04T12:42:55.234Z"\n}',
//   { contentType: "application/json" }
// );
// data.append(
//   "attachment",
//   fs.createReadStream(
//     "/C:/Users/USER/Desktop/DevWkSpace/WebDev/html mini project/img/gobe-classic.jpeg"
//   )
// );
// let config = {
//   method: "post",
//   maxBodyLength: Infinity,
//   url: "http://localhost:9009/mesh-suite/v1.0/notifications/attach-email/push",
//   headers: {
//     ...data.getHeaders(),
//   },
//   data: data,
// };
// axios
//   .request(config)
//   .then((response) => {
//     console.log(JSON.stringify(response.data));
//   })
//   .catch((error) => {
//     console.log(error);
//   });
