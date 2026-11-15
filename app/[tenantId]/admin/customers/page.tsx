"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

/** Legacy Customers route — redirects to Service Requests */
export default function CustomersRedirect() {
  const router = useRouter();
  const params = useParams();
  const tenantId = params?.tenantId as string;

  useEffect(() => {
    if (tenantId) {
      router.replace(`/${tenantId}/admin/service-requests`);
    }
  }, [tenantId, router]);

  return null;
}
