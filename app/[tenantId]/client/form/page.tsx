"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

// service
import { useQuery } from "@tanstack/react-query";
import services from "@/services";

// components
import StepsNav from "./components/StepsNav";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

// componetns
import FormSection from "./formElements/FormSection";
import { toast } from "sonner";
import FormSubmission from "./components/FormSubmission";
import useClientForm from "@/hooks/useClientForm";
import useUser from "@/hooks/useUser";

// utils
import mergeForm from "@/utils/MergeFormFields/MergeFormFields";
import FormFillingLoader from "./components/FormFillingLoader";
import CompanyThemedButton from "@/components/Buttons/CompanyThemedButton";

function FillFormHere() {
  const { user } = useUser();

  const [swiperInstance, setSwiperInstance] = useState<any>();
  const [swiperPosition, setSwiperPosition] = useState("first");

  //
  const search = useSearchParams();

  let formId = search.get("id");

  let responseId = search.get("response");

  // GET USER RESPONSE
  const {
    data: formResponse,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["form response", responseId],
    queryFn: services.getFormUserResponseById(responseId!),
    enabled: Boolean(responseId),
  });

  // GET ALL FORM DETAILS
  const { data: formData, refetch: formRefectch } = useQuery({
    queryKey: ["form", formId],
    queryFn: services.getFormById(formId),
    enabled: Boolean(formId) && Boolean(user),
  });

  // refetch user response and merge on mount
  useEffect(() => {
    refetch();
    formRefectch();
    selectClientForm(null);
  }, []);

  //

  // store form in LS
  const { selectClientForm, clientForm, saveResponsesRemote, savingResponses } =
    useClientForm();

  useEffect(() => {
    if (!isRefetching && formData && formResponse) {
      selectClientForm({
        ...mergeForm(formResponse.id, formData, formResponse?.inputData),
        isCompleted: false,
      });
    }
  }, [isRefetching, formData, formResponse]);

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
  if (clientForm && clientForm?.formSections) {
    let layout = clientForm?.layout;
    return (
      <div className="relative flex-col min-h-screen bg-[#F8FAFC] flex md:flex-row gap-5 p-2">
        <div className="hidden md:block w-[21rem] fixed bg-[#E2E8F0]  rounded-lg p-5 h-[91vh] ">
          <StepsNav
            layout={layout}
            swiperInstance={swiperInstance}
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
              className=" fixed right-10 z-50 bg-white top-20 px-4 py-2 rounded-full border border-gray-600 text-gray-600"
              onClick={() => {
                toast.loading("Saving, please wait...");

                saveResponsesRemote(user?.id);
              }}
            >
              Save and continue later
            </button>
            {/* GENERAL LAYOUT FOR FORM SECTIONS*/}
            {layout.toLowerCase() == "general" && (
              <div className="mx-auto min-h-screen w-[60%] mt-10 ">
                {/* @ts-ignore */}
                {clientForm?.formSections
                  ?.filter((item: any) => !item.isDeleted)
                  .sort((a: any, b: any) => a?.ordering - b?.ordering)
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
            )}

            {/* CARD LAYOUT FOR FORM SECTIONS */}
            {layout.toLowerCase() == "card" && (
              <div className="mx-auto  w-[60vw] mt-10">
                <Swiper
                  pagination={true}
                  // @ts-ignore
                  onSwiper={(swiper) => setSwiperInstance(swiper)}
                  onReachBeginning={() => setSwiperPosition("first")}
                  onReachEnd={() => setSwiperPosition("last")}
                  onActiveIndexChange={(e) => {
                    if (!e.isBeginning && !e.isEnd) {
                      setSwiperPosition("");
                    }
                  }}
                  breakpoints={{
                    320: {
                      slidesPerView: 1,
                      spaceBetween: 10,
                    },
                    640: {
                      slidesPerView: 1,
                      spaceBetween: 10,
                    },
                    1080: {
                      slidesPerView: 1,
                      spaceBetween: 10,
                    },
                    1600: {
                      slidesPerView: 1,
                      spaceBetween: 10,
                    },
                  }}
                >
                  {clientForm?.formSections
                    ?.filter((item: any) => !item.isDeleted)
                    .sort((a: any, b: any) => a?.ordering - b?.ordering)
                    .map((section: any, idx: any) => {
                      return (
                        <SwiperSlide key={idx}>
                          <div
                            style={{ scrollMarginTop: "5rem" }}
                            id={section?.id}
                            key={section?.id}
                            className="rounded-lg w-full mb-10"
                          >
                            <FormSection section={section} />
                          </div>
                          <div className="flex items-center justify-between">
                            <button
                              disabled={swiperPosition === "first"}
                              className={`${
                                swiperPosition === "first"
                                  ? "disabled"
                                  : "block"
                              }  border px-4 py-2 border-gray-700 rounded-lg disabled:cursor-not-allowed text-sm`}
                              onClick={() => swiperInstance?.slidePrev()}
                            >
                              Back
                            </button>

                            {swiperPosition === "last" ? (
                              <FormSubmission showOnlySubmitButton />
                            ) : (
                              <CompanyThemedButton
                                disabled={swiperPosition === "last"}
                                className={`${
                                  swiperPosition === "last"
                                    ? "disabled"
                                    : "block"
                                }  w-9 place-content-center  hover:bg-gray-50 disabled:cursor-not-allowed  ml-5`}
                                onClick={() => swiperInstance?.slideNext()}
                              >
                                Next
                              </CompanyThemedButton>
                            )}
                          </div>
                          {swiperPosition === "last" && (
                            <div>
                              <p className="mt-10 font-light mx-auto text-center text-sm text-gray-600">
                                You cannot edit this form once it has been
                                submitted for processing
                              </p>
                            </div>
                          )}
                        </SwiperSlide>
                      );
                    })}
                </Swiper>
              </div>
            )}
          </div>
        )}
      </div>
    );
  } else {
    return <FormFillingLoader />;
  }
}

export default FillFormHere;
