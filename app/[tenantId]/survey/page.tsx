"use client";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import services from "@/services";
import { setPublicTenantID } from "@/services/localService";
import ProcessForm from "./_components/ProcessForm";
import { HiOutlineDocument } from "react-icons/hi2";

function Survey() {
  const searchParams = useSearchParams();
  const params = useParams();

  const formId = searchParams.get("f");
  const companyId = searchParams.get("c");
  const tenantId =
    typeof params?.tenantId === "string"
      ? params.tenantId
      : Array.isArray(params?.tenantId)
        ? params.tenantId[0]
        : undefined;

  useEffect(() => {
    if (tenantId) {
      setPublicTenantID(tenantId);
    }
  }, [tenantId]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["public form", formId, tenantId, companyId],
    queryFn: services.getFormByIdExternal(formId, tenantId, companyId),
    enabled: Boolean(formId),
    retry: (failureCount, err: any) => {
      const status = err?.response?.status;
      if (status === 401 || status === 403 || status === 404) return false;
      return failureCount < 2;
    },
  });

  if (!formId) {
    return (
      <SurveyUnavailable message="This form link is missing a form id." />
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <LoadingIcon />
      </div>
    );
  }

  if (isError || !data) {
    const status = (error as any)?.response?.status;
    const message =
      status === 403
        ? "This form is not available on a public link. In the form settings, turn on anonymous/public access, then publish and copy the new link."
        : status === 404
          ? "This form could not be found for this company. Open it from the company admin portal and use Share to copy a fresh link."
          : "This form could not be loaded. Confirm it is published, then copy the share link again from the company admin form page.";
    return <SurveyUnavailable message={message} />;
  }

  return <ProcessForm form={data} />;
}

function SurveyUnavailable({ message }: { message: string }) {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <HiOutlineDocument size={28} className="text-slate-400" />
        <h1 className="mt-3 text-xl font-semibold text-slate-900">
          Form unavailable
        </h1>
        <p className="mt-2 text-sm text-slate-600">{message}</p>
      </div>
    </div>
  );
}

export default Survey;
