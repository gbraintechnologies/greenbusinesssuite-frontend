"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

// service
import { useQuery } from "@tanstack/react-query";
import services from "@/services";

// components
import StepsNav from "./components/StepsNav";
import FormFilling from "./components/FormFilling";

function FillFormHere() {
  const search = useSearchParams();

  let formID = search.get("id");

  const { data: form, isLoading } = useQuery({
    queryKey: ["form", formID],
    queryFn: services.getFormById(formID),
    enabled: Boolean(formID),
  });

  return (
    <div className="relative flex-col flex md:flex-row gap-5 p-2">
      <div className="hidden md:block w-3/12 bg-[#E2E8F0]  rounded-lg p-5 h-[91vh] sticky top-0">
        <StepsNav form={form} />
      </div>

      <FormFilling form={form} />
    </div>
  );
}

export default FillFormHere;
