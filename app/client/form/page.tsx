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
import { lowerCaseNoSpace } from "@/utils/LowerCaseNoSpace/LowerCaseNoSpace";
import mergeForm from "@/utils/MergeFormFields/MergeFormFields";
import { IoIosArrowForward } from "react-icons/io";

function FillFormHere() {
  const { user } = useUser();

  //
  const search = useSearchParams();

  let formId = search.get("id");

  let companyName = search.get("company");

  const [fullCompanyName, setFullCompanyName] = useState("");

  // GET USER RESPONSE
  const { data: formUserResponse, isLoading } = useQuery({
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

  console.log("form data", formData);
  console.log("form user response", formUserResponse);

  // COMBINE FORM DATA AND FORM RESPONSE
  let mergedForm =
    formData &&
    formUserResponse &&
    mergeForm(
      formUserResponse[0]?.id,
      formData,
      formUserResponse[0]?.inputData
    );

  const { data: companies } = useQuery({
    queryKey: ["all companies"],
    queryFn: services.getAllCompanies(),
  });

  // store form in LS
  const { selectClientForm, clientForm, saveResponsesRemote, savingResponses } =
    useClientForm();

  useEffect(() => {
    if (companies) {
      setFullCompanyName(
        companies?.find(
          (company: any) =>
            lowerCaseNoSpace(company?.company_name) == companyName
        )?.company_name
      );
    }
  }, [companies]);

  useEffect(() => {
    if (mergedForm && fullCompanyName && !Boolean(clientForm)) {
      selectClientForm({
        ...mergedForm,
        companyName: fullCompanyName,
        isCompleted: false,
      });
    }
  }, [mergedForm, fullCompanyName]);

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
    return (
      <div className="relative h-screen flex-col bg-[#F8FAFC] flex md:flex-row gap-5 p-2">
        <div className="hidden md:block w-[21rem] fixed bg-[#E2E8F0]  rounded-lg p-5 h-[91vh] ">
          <p className="font-light text-gray-600 text-sm">FORM STEPS</p>

          <div className="flex flex-col gap-4 mt-5">
            <button className="bg-gray-300 animate-pulse w-full px-3 py-3 rounded-xl flex items-center justify-between">
              <div className="flex items-center w-[90%] gap-2">
                <div className="w-7  h-7 text-xs rounded-full flex items-center justify-center font-light bg-gray-700 animate-pulse"></div>
                <p className="text-base  w-full h-10 bg-gray-400 rounded-lg animate-pulse" />
              </div>
              <IoIosArrowForward size={20} />
            </button>
            <button className="bg-gray-300 animate-pulse w-full px-3 py-3 rounded-xl flex items-center justify-between">
              <div className="flex items-center w-[90%] gap-2">
                <div className="w-7  h-7 text-xs rounded-full flex items-center justify-center font-light bg-gray-700 animate-pulse"></div>
                <p className="text-base  w-full h-10 bg-gray-400 rounded-lg animate-pulse" />
              </div>
              <IoIosArrowForward size={20} />
            </button>
            <button className="bg-gray-300 animate-pulse w-full px-3 py-3 rounded-xl flex items-center justify-between">
              <div className="flex items-center w-[90%] gap-2">
                <div className="w-7  h-7 text-xs rounded-full flex items-center justify-center font-light bg-gray-700 animate-pulse"></div>
                <p className="text-base  w-full h-10 bg-gray-400 rounded-lg animate-pulse" />
              </div>
              <IoIosArrowForward size={20} />
            </button>
            <button className="bg-gray-300 animate-pulse w-full px-3 py-3 rounded-xl flex items-center justify-between">
              <div className="flex items-center w-[90%] gap-2">
                <div className="w-7  h-7 text-xs rounded-full flex items-center justify-center font-light bg-gray-700 animate-pulse"></div>
                <p className="text-base  w-full h-10 bg-gray-400 rounded-lg animate-pulse" />
              </div>
              <IoIosArrowForward size={20} />
            </button>
            <button className="bg-gray-300 animate-pulse w-full px-3 py-3 rounded-xl flex items-center justify-between">
              <div className="flex items-center w-[90%] gap-2">
                <div className="w-7  h-7 text-xs rounded-full flex items-center justify-center font-light bg-gray-700 animate-pulse"></div>
                <p className="text-base  w-full h-10 bg-gray-400 rounded-lg animate-pulse" />
              </div>
              <IoIosArrowForward size={20} />
            </button>
            <button className="bg-gray-300 animate-pulse w-full px-3 py-3 rounded-xl flex items-center justify-between">
              <div className="flex items-center w-[90%] gap-2">
                <div className="w-7  h-7 text-xs rounded-full flex items-center justify-center font-light bg-gray-700 animate-pulse"></div>
                <p className="text-base  w-full h-10 bg-gray-400 rounded-lg animate-pulse" />
              </div>
              <IoIosArrowForward size={20} />
            </button>
          </div>
        </div>
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
          </div>{" "}
        </div>
      </div>
    );
  }
}

export default FillFormHere;
