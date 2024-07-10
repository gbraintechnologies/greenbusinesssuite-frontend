"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

// service
import { useQuery } from "@tanstack/react-query";
import services from "@/services";

// components
import StepsNav from "./components/StepsNav";

// componetns
import FormSection from "./formElements/FormSection";
import toast from "react-hot-toast";
import FormSubmission from "./components/FormSubmission";
import useClientForm from "@/hooks/useClientForm";
import useUser from "@/hooks/useUser";

// utils
import mergeForm from "@/utils/MergeFormFields/MergeFormFields";
import FormFillingLoader from "./components/FormFillingLoader";

function FillFormHere() {
  const { user } = useUser();

  //
  const search = useSearchParams();

  let formId = search.get("id");

  let companyId = search.get("company");

  // GET USER RESPONSE
  const {
    data: formUserResponse,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["form", user?.id, formId],
    queryFn: services.retrieveFormUserResponses(user?.id, formId),
    enabled: Boolean(formId && user?.id),
  });

  // GET ALL FORM DETAILS
  const { data: formData } = useQuery({
    queryKey: ["form", formId],
    queryFn: services.getFormById(formId),
    enabled: Boolean(formId) && Boolean(user),
  });

  const [mergedForm, setMergedForm] = useState(null);

  // refetch user response and merge on mount
  useEffect(() => {
    refetch();
  }, []);

  //
  useEffect(() => {
    if (!isRefetching && formData && formUserResponse) {
      setMergedForm(
        mergeForm(
          formUserResponse[0]?.id,
          formData,
          formUserResponse[0]?.inputData
        )
      );
    }
  }, [isRefetching]);

  // store form in LS
  const { selectClientForm, clientForm, saveResponsesRemote, savingResponses } =
    useClientForm();

  useEffect(() => {
    if (Boolean(mergedForm) && companyId && !Boolean(clientForm)) {
      selectClientForm({
        // @ts-ignore
        ...mergedForm,
        companyId: companyId,
        isCompleted: false,
      });
    }
  }, [mergedForm, companyId]);

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

  // SKELETON LOADING FOR WHEN FORM ISN'T READY
  if (clientForm) {
    return (
      <div className="relative flex-col min-h-screen bg-[#F8FAFC] flex md:flex-row gap-5 p-2">
        <div className="hidden md:block w-[21rem] fixed bg-[#E2E8F0]  rounded-lg p-5 h-[91vh] ">
          <StepsNav
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            handleClickScroll={handleClickScroll}
            form={clientForm}
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

                saveResponsesRemote(user?.id);
              }}
            >
              Save and continue later
            </button>
            {/* FORM SECTIONS FOR FILLING */}
            <div className="mx-auto min-h-screen w-[60%] mt-10 ">
              {/* @ts-ignore */}
              {clientForm?.formSections
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
  } else {
    return <FormFillingLoader />;
  }
}

export default FillFormHere;
