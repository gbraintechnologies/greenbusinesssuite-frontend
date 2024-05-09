"use client";

import React, { useState } from "react";
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

function FillFormHere() {
  const search = useSearchParams();
  const router = useRouter();

  let formID = search.get("id");

  const { data: form, isLoading } = useQuery({
    queryKey: ["form", formID],
    queryFn: services.getFormById(formID),
    enabled: Boolean(formID),
  });

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
      <div className="ml-[22rem] w-full mt-5 mb-56">
        {/* SAVE AND CONTINUE LATER */}
        <button
          className=" fixed right-10 top-20 px-4 py-2 rounded-full border border-gray-600 text-gray-600"
          onClick={() => {
            toast.loading("Saving, please wait...");

            setTimeout(() => {
              toast.dismiss();
              toast.success("Saved!");
              router.push("/client");
            }, 3000);
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
    </div>
  );
}

export default FillFormHere;
