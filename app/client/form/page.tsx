"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

// service
import { useQuery } from "@tanstack/react-query";
import services from "@/services";

// components
import StepsNav from "./components/StepsNav";
import { useRouter } from "next/navigation";

// componetns
import FormSection from "./formElements/FormSection";
import toast from "react-hot-toast";
import FormSubmission from "./components/FormSubmission";
import useClientForm from "@/hooks/useClientForm";

function FillFormHere() {
  const search = useSearchParams();
  const router = useRouter();

  let formID = search.get("id");
  let companyName = search.get("company");

  const { data: form, isLoading } = useQuery({
    queryKey: ["form", 43],
    queryFn: services.getFormById(43),
    enabled: Boolean(formID),
  });

  // store form in LS
  const { selectClientForm, saveResponsesRemote, savingResponses } =
    useClientForm();

  useEffect(() => {
    if (Boolean(form)) {
      selectClientForm({
        formSections: form?.formSections.filter((item: any) => !item.isDeleted),
        id: form?.id,
        layout: form?.layout,
        companyName: companyName,
        isCompleted: false,
      });
    }
  }, [form]);

  const [activeSection, setActiveSection] = useState(null);

  const handleClickScroll = (sec: any) => {
    const element = document.getElementById(sec);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  };

  return (
    <div className="relative flex-col bg-[#F8FAFC] flex md:flex-row gap-5 p-2">
      <div className="hidden md:block w-[21rem] fixed bg-[#E2E8F0]  rounded-lg p-5 h-[91vh] ">
        <StepsNav
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          handleClickScroll={handleClickScroll}
          form={form}
        />
      </div>

      {/* FORM SECTIONS FOR FILLING */}
      {isLoading ? (
        <div className="ml-[22rem] w-full mt-5 mb-56 flex flex-col gap-3">
          <div>
            <div className="h-10 mx-auto w-[70%] mt-10  bg-gray-200 animate-pulse rounded-xl"></div>
            <div className="h-[20rem] mx-auto w-[70%] mt-2  bg-gray-200 animate-pulse rounded-xl"></div>
          </div>
          <div>
            <div className="h-10 mx-auto w-[70%] mt-10  bg-gray-200 animate-pulse rounded-xl"></div>
            <div className="h-[20rem] mx-auto w-[70%] mt-2  bg-gray-200 animate-pulse rounded-xl"></div>
          </div>
          <div>
            <div className="h-10 mx-auto w-[70%] mt-10  bg-gray-200 animate-pulse rounded-xl"></div>
            <div className="h-[20rem] mx-auto w-[70%] mt-2  bg-gray-200 animate-pulse rounded-xl"></div>
          </div>
          <div>
            <div className="h-10 mx-auto w-[70%] mt-10  bg-gray-200 animate-pulse rounded-xl"></div>
            <div className="h-[20rem] mx-auto w-[70%] mt-2  bg-gray-200 animate-pulse rounded-xl"></div>
          </div>
        </div>
      ) : (
        <div className="ml-[22rem] w-full mt-5 mb-56">
          {/* SAVE AND CONTINUE LATER */}
          <button
            disabled={savingResponses}
            className=" fixed right-10 top-20 px-4 py-2 rounded-full border border-gray-600 text-gray-600"
            onClick={() => {
              toast.loading("Saving, please wait...");

              saveResponsesRemote();
            }}
          >
            Save and continue later
          </button>
          {/* FORM SECTIONS FOR FILLING */}
          <div className="mx-auto w-[60%] mt-10 ">
            {form?.formSections
              ?.filter((item: any) => !item.isDeleted)
              .map((section: any) => {
                return (
                  <div
                    style={{ scrollMarginTop: "5rem" }}
                    id={section?.id}
                    key={section?.id}
                    className="rounded-lg w-full mb-10"
                  >
                    <FormSection section={section} />
                  </div>
                );
              })}

            {/* submit form */}
            <div className="mt-10">
              <FormSubmission />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FillFormHere;
