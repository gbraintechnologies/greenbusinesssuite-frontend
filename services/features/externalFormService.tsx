import { noAuthApi as noAuthMesh } from "../meshNoAuthClient";
import defaultMeshApi from "../defaultMeshClient";
import { getToken } from "../localService";

function tenantHeaders(tenantId?: string | null) {
  return tenantId ? { tenantid: tenantId } : undefined;
}

function looksLikeForm(data: any) {
  return Boolean(
    data &&
      (data.id || data.formId || data.name || Array.isArray(data.formSections))
  );
}

async function tryGetForm(path: string, tenantId?: string | null) {
  const data = await noAuthMesh
    .get(path, { headers: tenantHeaders(tenantId) })
    .then((res) => res.data);
  if (!looksLikeForm(data)) {
    throw Object.assign(new Error("Empty form payload"), { response: { status: 404 } });
  }
  return data;
}

async function tenantsToTry(
  routeTenant?: string | null,
  companyId?: string | number | null
) {
  const tenants: Array<string | null> = [];
  const add = (value?: string | null) => {
    const next = value?.trim() || null;
    if (next && !tenants.includes(next)) tenants.push(next);
  };
  add(routeTenant ?? null);

  if (companyId != null && companyId !== "") {
    try {
      const branding = await noAuthMesh
        .get(`/company-branding/find-by-company-id/${companyId}`)
        .then((res) => res.data);
      add(branding?.tenancyId ?? branding?.companyIdentifier ?? null);
    } catch {
      // Branding lookup is optional.
    }
  }

  tenants.push(null);
  return tenants;
}

/**
 * Public form fetch for shared survey links.
 * Tries published-form access, builder get, then external forms-service,
 * across the URL tenant and the company tenancy from ?c=.
 */
export const getFormByIdExternal = (
  id: any,
  tenantId?: string | null,
  companyId?: string | number | null
) => {
  return async () => {
    const token = getToken();
    if (token) {
      try {
        const authenticated = await defaultMeshApi
          .get(`/forms/builder/${id}`)
          .then((res) => res.data);
        if (looksLikeForm(authenticated)) return authenticated;
      } catch {
        // Fall through to anonymous public endpoints.
      }
    }

    const tenants = await tenantsToTry(tenantId, companyId);
    const paths = [
      `/forms/builder/access-published-form/${id}`,
      `/forms/builder/${id}`,
      `/external/forms-service/forms/${id}`,
    ];

    let lastError: any = null;
    for (const tenant of tenants) {
      for (const path of paths) {
        try {
          return await tryGetForm(path, tenant);
        } catch (error: any) {
          lastError = error;
        }
      }
    }

    throw lastError ?? new Error("Form could not be loaded");
  };
};

function responseHeaders(tenantId?: string | null, withAuth = false) {
  const headers: Record<string, string> = {};
  if (tenantId) headers.tenantid = tenantId;
  if (withAuth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

function isAuthFailure(error: any) {
  const status = error?.response?.status;
  return status === 401 || status === 403;
}

/**
 * Public / anonymous form submit.
 * `POST /external/forms-service/collect-response` is gated (403 in the browser).
 * Use the same FormData contract as invite submit: `POST /forms/response/create`.
 */
export const submitPublicFormResponse = async (
  data: any,
  tenantId?: string | null
) => {
  const token = getToken();

  try {
    return await noAuthMesh.post(`/forms/response/create`, data, {
      headers: responseHeaders(tenantId, Boolean(token)),
    });
  } catch (createError: any) {
    try {
      return await noAuthMesh.post(
        `/external/forms-service/collect-response`,
        data,
        { headers: responseHeaders(tenantId, false) }
      );
    } catch (collectError: any) {
      if (token && isAuthFailure(createError)) {
        try {
          return await defaultMeshApi.post(`/forms/response/create`, data);
        } catch {
          // Keep the more specific public-submit error.
        }
      }
      throw collectError?.response ? collectError : createError;
    }
  }
};
