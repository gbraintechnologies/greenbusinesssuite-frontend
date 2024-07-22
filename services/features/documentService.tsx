import authApi from "../meshAuthClient";
import multipartMeshApi from "../multipartMeshClient";

export const getAllUserUploads = (userId: any) => {
  return () =>
    authApi.get(`/s3/resource/user-files/${userId}`).then((res) => res.data);
};

export const getAllIssuedDocs = (userId: any, companyId: any) => {
  return () =>
    authApi
      .get(`/s3/resource/all-issued-docs/${userId}/${companyId}`)
      .then((res) => res.data);
};

export const getAllIssuedDocsRaw = (userId: any, companyId: any) => {
  return authApi.get(`/s3/resource/all-issued-docs/${userId}/${companyId}`);
};

export const uploadUserFile = (
  userId: any,
  companyId: any,
  formId: any,
  formData: FormData,
  fileName: string
) => {
  return multipartMeshApi.post(
    `s3/resource/file/${userId}/${companyId}/${formId}/${fileName}`,
    formData
  );
};

export const getUserUploadedDocsByFormId = (userId: any, formId: any) => {
  return () =>
    authApi
      .get(`/s3/resource/user-files/${userId}/${formId}`)
      .then((res) => res.data);
};

export const getUserIssuedDocsByFormIdAndCompanyId = (
  formId: any,
  companyId: any,
  userId: any
) => {
  return () =>
    authApi
      .get(`/s3/resource/issued-docs/${formId}/${companyId}/${userId}`)
      .then((res) => res.data);
};

export const issueFileToUserWithFormId = (
  userId: any,
  companyId: any,
  formId: any,
  formData: FormData,
  fileName: string
) => {
  return multipartMeshApi.post(
    `/s3/resource/issued/${userId}/${companyId}/${formId}/${fileName}`,
    formData
  );
};
