"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

//
import { useQuery } from "@tanstack/react-query";
import services from "@/services";

// hooks
import useForm from "@/hooks/useForm";

// views
import Builder from "./views/Builder";
import Connect from "./views/Connect";

//
import GeneralFormSettings from "./components/GeneralFormSettings";

function FormEditing({ params }: any) {
  const { view, selectForm } = useForm();

  const { formID } = params;

  // Get form Details
  const { data, isLoading } = useQuery({
    queryKey: ["form", formID],
    queryFn: services.getFormById(formID),
    enabled: Boolean(formID),
  });

  useEffect(() => {
    if (data) {
      selectForm(data);
    }
  }, [data, isLoading]);

  return (
    <div className="w-full min-h-[100vh] flex  justify-between">
      <div className="w-[76%] min-h-screen">
        {view === "builder" && <Builder />}
        {view === "connect" && <Connect />}
      </div>

      <div className="w-[24%] fixed right-1">
        <GeneralFormSettings />
      </div>
    </div>
  );
}

export default FormEditing;
