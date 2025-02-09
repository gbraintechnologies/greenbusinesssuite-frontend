"use client";

import React, { useState } from "react";

// components

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

import CompanyThemedButton from "@/components/Buttons/CompanyThemedButton";
import StepsNav from "../../client/form/components/StepsNav";
import FormFillingLoader from "../../client/form/components/FormFillingLoader";
import useClientPublicForm from "@/hooks/useClientPublicForm";
import FormSection from "../formElements/FormSection";
import Border from "@/components/Border/Border";
import FormSubmitBtn from "../FormSubmitBtn";

function FillForm() {
  const [swiperInstance, setSwiperInstance] = useState<any>();
  const [swiperPosition, setSwiperPosition] = useState("first");

  const { clientForm } = useClientPublicForm();

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
    //
    const layout = clientForm?.layout ? clientForm.layout : "general";
    //
    return (
      <div className="relative flex-col min-h-screen bg-[#F8FAFC] flex md:flex-row gap-5 p-2">
        <div className="hidden lg:block  w-0 lg:w-[21rem] fixed bg-[#E2E8F0]  rounded-lg p-5 h-[91vh] ">
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
        <div className="ml-0 lg:ml-[22rem] w-full mt-5 mb-56">
          {/* GENERAL LAYOUT FOR FORM SECTIONS*/}
          {layout.toLowerCase() == "general" && (
            <div className="mx-auto min-h-screen w-full lg:w-[60%] mt-10 ">
              {/* FORM TITLE */}
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {clientForm?.name}
              </h1>
              <div className="my-5">
                <Border />
              </div>
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
                <FormSubmitBtn />
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
                          Form Section in sideling mode
                          {/* <FormSection section={section} /> */}
                        </div>
                        <div className="flex items-center justify-between">
                          <button
                            disabled={swiperPosition === "first"}
                            className={`${
                              swiperPosition === "first" ? "disabled" : "block"
                            }  border px-4 py-2 border-gray-700 rounded-lg disabled:cursor-not-allowed text-sm`}
                            onClick={() => swiperInstance?.slidePrev()}
                          >
                            Back
                          </button>

                          {/* {swiperPosition === "last" ? (
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
                            )} */}
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
      </div>
    );
  } else {
    return <FormFillingLoader />;
  }
}

export default FillForm;
