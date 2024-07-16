"use client";

import React, { useEffect } from "react";

import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

// icons
import { BsThreeDots } from "react-icons/bs";

import { useRouter } from "next/navigation";

import FormPreviewIcon from "@/public/icons/FormPreviewIcon";

// utils
import FormatDate from "@/utils/FormatDate/FormatDate";

import { useQueryClient } from "@tanstack/react-query";

function DocumentCard({ document }: any) {
  // console.log("docu", document);
  //
  let { id, updatedOn } = document;

  const queryClient = useQueryClient();

  const router = useRouter();

  const options = [
    {
      title: "Download",
      func: () => {
        // router.push(`/client/form?id=${document?.id}`);
      },
    },
  ];

  return (
    <>
      <div className="w-full rounded-lg shadow-md bg-[#F8FAFC]">
        <button
          className={`flex items-center bg-gradient-to-br from-[#FFCAD4] to bg-[#FEA7B7] justify-center w-full h-[10rem] rounded-tl-lg rounded-tr-lg`}
        >
          <FormPreviewIcon />
        </button>
        <div className="p-3">
          <button className="text-lg w-full text-left font-medium">
            {/* @ts-ignore */}
            Name
          </button>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs font-light pr-4">{FormatDate(updatedOn)}</p>
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
                  {options &&
                    // @ts-ignore
                    options?.map((option: any, idx: any) => {
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

                            {idx % 2 === 0 && (
                              <div className="border-t-[1px] border-gray-200 mx-auto w-[80%] text-center" />
                            )}
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

export default DocumentCard;
