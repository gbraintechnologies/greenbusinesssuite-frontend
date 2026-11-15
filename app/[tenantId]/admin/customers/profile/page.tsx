"use client";

import { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

/** Legacy Customers profile — redirects to Service Requests profile */
export default function CustomersProfileRedirect() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const tenantId = params?.tenantId as string;
  const id = searchParams.get("id");

  useEffect(() => {
    if (tenantId) {
      const query = id ? `?id=${id}` : "";
      router.replace(`/${tenantId}/admin/service-requests/profile${query}`);
    }
  }, [tenantId, id, router]);

  return null;
}
