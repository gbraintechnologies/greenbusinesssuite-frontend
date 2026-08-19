"use client";

import React, { useEffect } from "react";

import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

// icons
import { BsThreeDots } from "react-icons/bs";
import { useRouter } from "next/navigation";

import FormPreviewIcon from "@/public/icons/FormPreviewIcon";

// components
import { toast } from "sonner";

import services from "@/services";
import useCompany from "@/hooks/useCompany";
import { IoLockClosedOutline, IoLockOpenOutline } from "react-icons/io5";
import { PiNotePencilBold } from "react-icons/pi";
import { capitalize } from "@/utils/Capitalize/capitalize";

type Props = {
  form: any;
  addFormResponses?: boolean;
  onClick?: () => void;
};
function FormCard({ form, onClick, addFormResponses = true }: Props) {
  let { id, name, url, publishStatus, isAnonymous } = form;

  const router = useRouter();

  const { companyBranding: company } = useCompany();

  const [formResponsesCount, setFormResponsesCount] = useState(0);

  const options = [
    {
      title: "Preview",
      func: () => {
        router.push(
          `/${company?.company_identifier}/admin/forms/preview/${id}`
        );
      },
    },
    {
      title: "Details",
      func: () => {
        router.push(`/${company?.company_identifier}/admin/forms/${id}`);
      },
    },
    {
      title: "Copy link",
      func: () => {
        if (publishStatus !== "PUBLISHED") {
          toast.error("Error. Form Unpublished", {
            description: "Publish the form to generate a link",
          });
          return;
        }
        navigator.clipboard
          .writeText(
            `${window.location.origin}/${company?.company_identifier}/${
              isAnonymous ? "survey" : "invite-form"
            }?f=${id}&c=${form?.companyId ?? ""}`
          )
          .then(() => {
            toast.success("Link copied!");
          });
      },
    },
  ];

  //  7 colors to pick at random from
  const colors = [
    { a: "#392F5A", b: "#584B81" },
    { a: "#FFA245", b: "#FF8811" },
    { a: "#FFCAD4", b: "#FEA7B7" },
    { a: "#E2E8F0", b: "#E2E8F0" },
    { a: "#F4D06F", b: "#F7CC5A" },
  ];

  function getRandomInt(min: any, max: any) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  let color = colors[getRandomInt(0, 4)];

  const getFormResponses = async () => {
    const responses = await services.getFormResponsesById(id);
    setFormResponsesCount(responses.data?.content?.length);
  };

  useEffect(() => {
    if (addFormResponses) {
      getFormResponses();
    }
  }, []);

  return (
    <>
      <div className="w-full min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm sm:rounded-lg sm:border-0 sm:bg-[#F8FAFC] sm:shadow-md">
        <button
          onClick={() =>
            router.push(`/${company?.company_identifier}/admin/forms/${id}`)
          }
          className="relative flex h-24 w-full overflow-hidden rounded-t-xl bg-gradient-to-br from-indigo-950 to-gray-900 sm:h-[10rem] sm:rounded-t-lg"
        >
          <div className="pointer-events-none absolute left-1/2 top-[35%] -translate-x-1/2 scale-100 opacity-10 sm:scale-150">
            <FormPreviewIcon />
          </div>
          <div className="absolute inset-x-2 top-1.5 z-10 flex max-w-[calc(100%-1rem)] flex-wrap gap-1 sm:inset-x-3 sm:top-2 sm:gap-1.5">
            <span
              className={`inline-flex max-w-full min-w-0 items-center gap-0.5 truncate rounded-full px-1.5 py-0.5 text-[9px] font-medium text-white sm:gap-1 sm:px-3 sm:py-1 sm:text-[11px] sm:font-normal ${
                publishStatus == "PUBLISHED" ? "bg-green-700" : "bg-slate-500"
              }`}
            >
              <PiNotePencilBold className="shrink-0 text-[10px] sm:text-sm" />{" "}
              <span className="truncate">{capitalize(publishStatus)}</span>
            </span>
            {isAnonymous ? (
              <span className="inline-flex max-w-full min-w-0 items-center gap-0.5 truncate rounded-full bg-orange-600 px-1.5 py-0.5 text-[9px] font-medium text-white sm:gap-1 sm:px-3 sm:py-1 sm:text-[11px]">
                <IoLockOpenOutline className="shrink-0 text-[10px] sm:text-sm" />{" "}
                Public
              </span>
            ) : (
              <span className="inline-flex max-w-full min-w-0 items-center gap-0.5 truncate rounded-full bg-indigo-600 px-1.5 py-0.5 text-[9px] font-medium text-white sm:gap-1 sm:px-3 sm:py-1 sm:text-[11px]">
                <IoLockClosedOutline className="shrink-0 text-[10px] sm:text-sm" />{" "}
                Protected
              </span>
            )}
            {form?.multipleForms && (
              <span
                className="hidden max-w-full min-w-0 items-center gap-1 truncate rounded-full bg-fuchsia-600 px-3 py-1 text-[11px] font-normal text-white sm:inline-flex"
                title="Allows Multiple Responses"
              >
                <PiNotePencilBold className="shrink-0" /> Multiple responses
              </span>
            )}
          </div>
        </button>
        <div className="flex flex-col justify-between p-2.5 sm:p-3">
          <button
            onClick={() => {
              router.push(`/${company?.company_identifier}/admin/forms/${id}`);
            }}
            className="w-full truncate text-left text-sm font-semibold text-slate-900 sm:text-lg"
          >
            {name?.replace(/"/g, " ")}
          </button>
          <div className="mt-1.5 flex items-center justify-between gap-1 sm:mt-1">
            <p className="truncate pr-2 text-[10px] font-light text-slate-500 sm:pr-4 sm:text-xs">
              {formResponsesCount} response(s)
            </p>
            <Menu as="div" className="relative shrink-0">
              <div className="relative">
                <Menu.Button className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800">
                  <BsThreeDots />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-1 -top-1 z-[999999] flex w-40 flex-col rounded-lg bg-white text-left shadow-md">
                  {options.map((option: any, idx: any) => {
                    return (
                      <Menu.Item key={option.title}>
                        <div>
                          <button
                            className={`${
                              option.title.toLowerCase() === "delete"
                                ? "text-red-600"
                                : " text-gray-500"
                            } w-full px-4 py-3 text-left font-light hover:bg-gray-50`}
                            onClick={() => option.func()}
                          >
                            {option.title}
                          </button>
                        </div>
                      </Menu.Item>
                    );
                  })}
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </>
  );
}

export default FormCard;
