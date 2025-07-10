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
