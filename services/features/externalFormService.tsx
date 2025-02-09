import noAuthApi from "../meshDefaultNoAuthClient";
import { noAuthApi as noAuthMesh } from "../meshNoAuthClient";
export const getFormByIdExternal = (id: any) => {
  return () =>
    noAuthApi
      .get(`/external/forms-service/builder/${id}`)
      .then((res) => res.data);
};

export const submitPublicFormResponse = (data: any) => {
  return noAuthMesh.post(`/external/forms-service/create`, data);
};
