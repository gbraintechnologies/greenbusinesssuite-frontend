import { noAuthApi as noAuthMesh } from "../meshNoAuthClient";

/**
 * Public form fetch — GET /external/forms-service/forms/{id}
 * Tenant must come from the route (`/[tenantId]/survey`) or the backend
 * rejects the request with a 403.
 */
export const getFormByIdExternal = (id: any, tenantId?: string | null) => {
  return () =>
    noAuthMesh
      .get(`/external/forms-service/forms/${id}`, {
        headers: tenantId ? { tenantid: tenantId } : undefined,
      })
      .then((res) => res.data);
};

/**
 * Public form submit — POST /external/forms-service/collect-response
 */
export const submitPublicFormResponse = (
  data: any,
  tenantId?: string | null
) => {
  return noAuthMesh.post(`/external/forms-service/collect-response`, data, {
    headers: tenantId ? { tenantid: tenantId } : undefined,
  });
};
