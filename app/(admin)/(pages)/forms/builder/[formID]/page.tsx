"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";

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
import Loader from "@/components/Loader/Loader";

function FormEditing(props: any) {
  const params: any = use(props.params);
  useEffect(() => {
    typeof window !== "undefined" && window.scrollTo(0, 0);
  }, []);

  const { view, selectForm, isFormUpdating } = useForm();

  const [activeTab, setActiveTab] = useState("general");

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
    <div className="w-full min-h-[100vh] flex justify-between relative">
      {isFormUpdating && (
        <div className="absolute top-0 left-0 z-[50] w-full h-[100vh] inset-0 flex flex-col gap-2 items-center justify-center  backdrop-blur-md bg-black bg-opacity-10">
          <AiOutlineLoading3Quarters size={30} className="animate-spin" />
          <p className="text-lg font-bold">Updating Form</p>
          <p className="text-sm font-light">
            Please wait a moment while the form is updated
          </p>
        </div>
      )}
      <div className="w-[76%] min-h-screen">
        {view === "builder" && (
          <Builder
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            refetch={refetch}
            data={data}
          />
        )}
        {view === "connect" && <Connect />}
      </div>

      <div className="w-[24%] bg-white max-h-[100vh] pb-32   border-l-2 border-gray-200 fixed    right-4 overflow-y-scroll ">
        <GeneralFormSettings
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          refetch={refetch}
        />
      </div>
    </div>
  );
}

export default FormEditing;
