"use client";

import services from "@/services";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import FormSection from "../components/FormSectionCompany";

import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";

//
import { BsEye } from "react-icons/bs";

function PreviewForm({ params }: any) {
  let formId = params.formId;

  const { data: formData, isLoading } = useQuery({
    queryKey: ["form", formId],
    queryFn: services.getFormByIdDefault(formId),
    enabled: Boolean(formId),
  });

  const router = useRouter();

  return (
    <div className="bg-gray-50">
      <div className="pt-10 max-w-7xl flex items-center gap-7 ml-20">
        <button
          className="my-3 flex text-sm items-center gap-2"
          onClick={() => router.back()}
        >
          <IoIosArrowBack size={12} /> Go Back
        </button>

        <div className="bg-blue-100 text-blue-900  rounded-full px-5 py-2 text-sm inline-block">
          <div className="flex items-center gap-2">
            <BsEye />{" "}
            <span className="font-semibold ">
              Previewing {formData?.name} form
            </span>
          </div>
        </div>
      </div>

      {/* FORM FIELDFS */}
      {isLoading ? (
        <div className="w-full flex flex-col gap-3">
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
        <div className=" w-full  min-h-screen">
          {/* FORM SECTIONS FOR FILLING */}
          <div className="mx-auto w-[70%]">
            {formData &&
              formData?.formSections
                ?.filter((item: any) => !item.isDeleted)
                .map((section: any) => {
                  return (
                    <div
                      style={{ scrollMarginTop: "5rem" }}
                      id={section?.id}
                      key={section?.id}
                      className="rounded-lg w-full mb-10"
                    >
                      <FormSection viewOnly={true} section={section} />
                    </div>
                  );
                })}
          </div>
        </div>
      )}
    </div>
  );
}

export default PreviewForm;
