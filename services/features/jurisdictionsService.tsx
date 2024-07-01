import authApi from "../meshAuthClient";
import multipartMeshApi from "../multipartMeshClient";

export const allJurisdictions = () => {
  return () =>
    authApi.get("/jurisdictions/list-jurisdictions").then((res) => res.data);
};

// @Sidney, Example here, import the client as seen on top and use it in the api call below
export const exampleAPICallUsingMultipart = () => {
  return multipartMeshApi.get("/example-route");
};

export const createFreeInputJurisdiction = (data: any) => {
  return authApi.post("/jurisdictions/create-parent-address-scheme", data);
};

export const createParentDropdownJurisdiction = (data: any) => {
  return authApi.post(
    "/jurisdictions/create-parent-address-scheme-with-manual-entries",
    data
  );
};

export const getParentEntriesById = (id: number) => {
  return () =>
    authApi.get(`/jurisdictions/${id}/entries`).then((res) => res.data);
};

export const createChildEntries = (data: any) => {
  return authApi.post(
    "/jurisdictions/create-child-address-scheme-with-entries",
    data
  );
};

export const deleteJurisdictionByID = (id: any) => {
  return authApi.delete(`/jurisdictions/${id}`);
};
