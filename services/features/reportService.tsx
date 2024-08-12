import defaultMeshApi from "../defaultMeshClient";
import authApi from "../meshAuthClient";

export const uniqueUsersCount = (companyId: number) => {
  return () =>
    authApi
      .get(`/forms/response/unique-users/count/${companyId}`)
      .then((res) => res.data);
};

export const totalEntries = (companyId: number) => {
  return () =>
    authApi
      .get(`/forms/response/total-entries/${companyId}`)
      .then((res) => res.data);
};

export const companyFormStats = (companyId: number) => {
  return () =>
    authApi
      .get(`/forms/response/total-forms/${companyId}`)
      .then((res) => res.data);
};

export const linksOpened = (companyId: number) => {
  return () =>
    authApi
      .get(`/forms/response/links-opened/${companyId}`)
      .then((res) => res.data);
};

export const ignoredLinks = (companyId: number) => {
  return () =>
    authApi
      .get(`/forms/response/ignored-links/${companyId}`)
      .then((res) => res.data);
};
