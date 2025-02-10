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
        navigator.clipboard.writeText(url ?? "").then(() => {
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

  // TODO:  UPDATE TO FETCH VALUE FROM BACKEND DIRECTLY
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
      <div className="w-full rounded-lg shadow-md bg-[#F8FAFC]">
        <button
          onClick={() =>
            router.push(`/${company?.company_identifier}/admin/forms/${id}`)
          }
          style={
            {
              // backgroundColor: color?.a,
              // background: `linear-gradient(45deg, ${color?.a} 0%, ${color?.b} 100%)`,
            }
          }
          className={`flex items-center bg-gradient-to-br from-indigo-950 to bg-gray-900 justify-center w-full h-[10rem] rounded-tl-lg rounded-tr-lg`}
        >
          <FormPreviewIcon />
        </button>
        <div className="p-3">
          <div className="text-xs my-2">
            {isAnonymous ? (
              <span className="rounded-full text-orange-600 bg-orange-600 font-medium bg-opacity-10  py-1 px-4 flex items-center gap-1 w-fit">
                <IoLockOpenOutline /> Public
              </span>
            ) : (
              <span className="rounded-full text-indigo-600 bg-indigo-600 font-medium bg-opacity-10  py-1 px-4 flex items-center gap-1 w-fit">
                <IoLockClosedOutline /> Protected
              </span>
            )}
          </div>
          <button
            onClick={() => {
              router.push(`/${company?.company_identifier}/admin/forms/${id}`);
            }}
            className="text-lg w-full text-left font-medium"
          >
            {name?.replace(/"/g, " ")}
          </button>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs font-light pr-4">
              {formResponsesCount} response(s)
            </p>
            <Menu as="div" className="relative">
              <div className="relative">
                <Menu.Button className="relative">
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
                <Menu.Items className="absolute  w-40 right-1 -top-1 rounded-lg shadow-md flex flex-col bg-white text-left">
                  {options.map((option: any, idx: any) => {
                    return (
                      <Menu.Item>
                        <div>
                          <button
                            className={`${
                              option.title.toLowerCase() === "delete"
                                ? "text-red-600"
                                : " text-gray-500"
                            } py-3  px-4 font-light hover:bg-gray-50 text-left w-full`}
                            onClick={() => option.func()}
                          >
                            {option.title}
                          </button>

                          {/* {idx % 2 === 0 && (
                            <div className="border-t-[1px] border-gray-200 mx-auto w-[80%] text-center" />
                          )} */}
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
