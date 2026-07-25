import { noAuthApi as noAuthMesh } from "../meshNoAuthClient";

/**
 * Public form fetch. The survey link is anonymous (no stored auth), so the
 * tenant must come from the route (`/[tenantId]/survey`) or the backend
 * rejects the request with a 403.
 */
export const getFormByIdExternal = (id: any, tenantId?: string | null) => {
  return () =>
    noAuthMesh
      .get(`/external/forms-service/builder/${id}`, {
        headers: tenantId ? { tenantid: tenantId } : undefined,
      })
      .then((res) => res.data);
};

export const submitPublicFormResponse = (
  data: any,
  tenantId?: string | null
) => {
  return noAuthMesh.post(`/external/forms-service/create`, data, {
    headers: tenantId ? { tenantid: tenantId } : undefined,
  });
};
