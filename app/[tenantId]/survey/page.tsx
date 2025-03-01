"use client";

import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import services from "@/services";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React from "react";
import ProcessForm from "./_components/ProcessForm";

function Survey() {
  const searchParams = useSearchParams();

  const formId = searchParams.get("f");

  // const companyId = searchParams.get("c");

  const { data } = useQuery({
    queryKey: ["form", formId],
    queryFn: services.getFormByIdExternal(formId),
    enabled: Boolean(formId),
  });

  if (data) {
    return (
      <>
        <ProcessForm form={data} />
      </>
    );
  } else {
    return <LoadingIcon />;
  }
}

export default Survey;
