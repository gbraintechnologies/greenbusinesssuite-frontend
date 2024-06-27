"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// icons
import { AiOutlineLoading3Quarters } from "react-icons/ai";

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
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { view, selectForm } = useForm();

  const { formID } = params;

  // Get form Details
  const { data, isLoading, fetchStatus, refetch } = useQuery({
    queryKey: ["form", formID],
    queryFn: services.getFormById(formID),
    enabled: Boolean(formID),
  });

  useEffect(() => {
    if (data) {
      selectForm(data);
    }
  }, [data, isLoading, fetchStatus]);

  if (isLoading) {
    return (
      <div className="w-full h-[100vh] flex  items-center justify-center">
        <div className="flex flex-col items-center justify-center mx-auto text-center -mt-32 gap-4">
          <AiOutlineLoading3Quarters size={20} className="animate-spin" />{" "}
          Loading builder
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[100vh] flex  justify-between">
      <div className="w-[76%] min-h-screen">
        {view === "builder" && <Builder refetch={refetch} data={data} />}
        {view === "connect" && <Connect />}
      </div>

      <div className="w-[24%] overflow-y-scroll no-scrollbar fixed right-1">
        <GeneralFormSettings />
      </div>
    </div>
  );
}

export default FormEditing;
