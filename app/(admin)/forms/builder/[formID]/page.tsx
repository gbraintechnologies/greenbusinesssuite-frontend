"use client";

import { useRouter } from "next/navigation";

//
import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import useForm from "@/hooks/useForm";
import Builder from "./views/Builder";
import Connect from "./views/Connect";
import { useEffect } from "react";

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
      <div className="w-[80%] min-h-screen">
        {view === "builder" && <Builder />}

        {view === "connect" && <Connect />}
      </div>

      <div className="w-[20%]">
        <div className="bg-white min-h-[100vh] border-l-2 border-gray-200 p-3">
          General form settings
        </div>
      </div>
    </div>
  );
}

export default FormEditing;
