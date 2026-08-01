"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";

// icons
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FiSliders, FiX } from "react-icons/fi";

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
  const [settingsOpen, setSettingsOpen] = useState(false);

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
    <div className="relative flex min-h-[100vh] w-full justify-between overflow-x-hidden">
      {isFormUpdating && (
        <div className="absolute top-0 left-0 z-[50] w-full h-[100vh] inset-0 flex flex-col gap-2 items-center justify-center  backdrop-blur-md bg-black bg-opacity-10">
          <AiOutlineLoading3Quarters size={30} className="animate-spin" />
          <p className="text-lg font-bold">Updating Form</p>
          <p className="text-sm font-light">
            Please wait a moment while the form is updated
          </p>
        </div>
      )}
      <div className="min-h-screen w-full bg-surface-muted md:w-[76%]">
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

      {/* Desktop settings rail */}
      <div className="fixed bottom-0 right-0 top-[3.5rem] hidden w-[24%] overflow-y-auto border-l-2 border-brand-100 bg-white pb-32 md:block">
        <GeneralFormSettings
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          refetch={refetch}
        />
      </div>

      {/* Mobile settings trigger */}
      <button
        type="button"
        onClick={() => setSettingsOpen(true)}
        className="fixed bottom-5 right-4 z-40 flex h-12 items-center gap-2 rounded-full bg-brand-600 px-4 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 md:hidden"
      >
        <FiSliders size={17} />
        Settings
      </button>

      {/* Mobile settings drawer */}
      <div
        aria-hidden="true"
        onClick={() => setSettingsOpen(false)}
        className={`fixed inset-0 top-[3.5rem] z-40 bg-brand-900/30 transition-opacity md:hidden ${
          settingsOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed bottom-0 right-0 top-[3.5rem] z-50 w-[90vw] max-w-sm overflow-y-auto border-l border-brand-100 bg-white pb-24 shadow-2xl transition-transform duration-300 md:hidden ${
          settingsOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-brand-100 bg-white px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">Form settings</p>
            <p className="text-xs text-slate-500">Configure your form</p>
          </div>
          <button
            type="button"
            onClick={() => setSettingsOpen(false)}
            className="rounded-lg p-2 text-slate-500 hover:bg-brand-50"
            aria-label="Close form settings"
          >
            <FiX size={18} />
          </button>
        </div>
        <GeneralFormSettings
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          refetch={refetch}
        />
      </aside>
    </div>
  );
}

export default FormEditing;
