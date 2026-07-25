"use client";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import services from "@/services";
import { setPublicTenantID } from "@/services/localService";
import ProcessForm from "./_components/ProcessForm";

function Survey() {
  const searchParams = useSearchParams();
  const params = useParams();

  const formId = searchParams.get("f");
  const tenantId =
    typeof params?.tenantId === "string"
      ? params.tenantId
      : Array.isArray(params?.tenantId)
        ? params.tenantId[0]
        : undefined;

  // Keep the tenant available for anonymous response submission later on
  useEffect(() => {
    if (tenantId) {
      setPublicTenantID(tenantId);
    }
  }, [tenantId]);

  const { data } = useQuery({
    queryKey: ["form", formId, tenantId],
    queryFn: services.getFormByIdExternal(formId, tenantId),
    enabled: Boolean(formId && tenantId),
  });

  if (data) {
    return <ProcessForm form={data} />;
  }

  return <LoadingIcon />;
}

export default Survey;
