import authApi from "../meshAuthClient";

export const getBusinessProfileTypesCount = () => {
    return () =>
      authApi.get(`/business-profiles/count/type-of-business`).then((res) => res.data);
  };


  export const getBusinessProfileGenderCount = () => {
    return () =>
      authApi.get(`/business-profiles/count/gender`).then((res) => res.data);
  };

  export const getBusinessProfileSectorCount = () => {
    return () =>
      authApi.get(`/business-profiles/count/sector`).then((res) => res.data);
  };

export const getAllBusinessProfiles = (page: number = 0, size: number = 20) => {
  return () =>
    authApi
      .get(`/business-profiles/all/${page}/${size}`)
      .then((res) => res.data);
};

export const getBusinessProfileById = (id: string | number) => {
  return () =>
    authApi.get(`/business-profiles/${id}`).then((res) => res.data);
};

export const getBusinessProfileByUserId = (userId: string | number) => {
  return () =>
    authApi.get(`/business-profiles/user/${userId}`).then((res) => res.data);
};
