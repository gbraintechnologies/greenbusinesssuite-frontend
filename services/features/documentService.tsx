import authApi from "../meshAuthClient";
import multipartMeshApi from "../multipartMeshClient";

export const allUserUploads = (userId: any) => {
  return () =>
    authApi.get(`/s3/upload/all-files/${userId}`).then((res) => res.data);
};

export const getIssuedDocs = (userId: any, companyId: any) => {
  return () =>
    authApi
      .get(`/s3/upload/all-issued-docs/${userId}/${companyId}`)
      .then((res) => res.data);
};

export const uploadUserFile = (
  userId: any,
  companyId: any,
  formData: FormData,
  file: string
) => {
  return multipartMeshApi.post(
    `s3/upload/file/${userId}/${companyId}/${file}`,
    formData
  );
};

export const issueFileToClient = (
  userId: any,
  companyId: any,
  formData: FormData,
  file: string
) => {
  return multipartMeshApi.post(
    `s3/upload/issued/${userId}/${companyId}/${file}`,
    formData
  );
};

export const getUserUploadedDocsByFormId = (userId: any, formId: any) => {
  return () =>
    authApi
      .get(`/s3/resource/user-files/${userId}/${formId}`)
      .then((res) => res.data);
};

export const issueFileToUserWithFormId = (
  userId: any,
  companyId: any,
  formId: any,
  formData: FormData,
  file: string
) => {
  return multipartMeshApi.post(
    `/s3/resource/file/${userId}/${companyId}/${formId}/${file}`,
    formData
  );
};
