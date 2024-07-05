import authApi from "../meshAuthClient";

export const uniqueUsersCount = (companyName: string) => {
  return () =>
    authApi
      .get(`/forms/response/unique-users/count/${companyName}`)
      .then((res) => res.data);
};

export const totalEntries = (companyName: string) => {
  return () =>
    authApi
      .get(`/forms/response/total-entries/${companyName}`)
      .then((res) => res.data);
};

export const companyFormStats = (companyName: string) => {
  return () =>
    authApi
      .get(`/forms/response/total-forms/${companyName}`)
      .then((res) => res.data);
};

export const linksOpened = (companyName: string) => {
  return () =>
    authApi
      .get(`/forms/response/links-opened/${companyName}`)
      .then((res) => res.data);
};

export const ignoredLinks = (companyName: string) => {
  return () =>
    authApi
      .get(`/forms/response/ignored-links/${companyName}`)
      .then((res) => res.data);
};
