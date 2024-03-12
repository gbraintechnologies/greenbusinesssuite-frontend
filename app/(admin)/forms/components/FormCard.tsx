"use client";

import React from "react";

import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";

// icons
import { BsThreeDots } from "react-icons/bs";
import { useRouter } from "next/navigation";
import services from "@/services";
import Error from "next/error";
import toast from "react-hot-toast";

function FormCard({ form }: any) {
  let {
    id,
    name,
    updatedOn,
    url,
    publishStatus,
    description,
    deadline,
    createdOn,
  } = form;

  const router = useRouter();
  const queryClient = useQueryClient();

  const options = [
    {
      title: "Open",
      func: () => {
        router.push(`/forms/builder/${id}`);
      },
    },
    {
      title: "Copy link",
      func: () => {
        //
      },
    },
    {
      title: "Rename",
      func: () => {
        //
      },
    },
    {
      title: "Duplicate",
      func: () => {
        //
      },
    },
    {
      title: "Delete",
      func: () => {
        //
        toast.loading("Deleting..");
        services
          .deleteForm(id)
          .then((res) => {
            toast.dismiss();
            console.log("deleting", res);
            toast.success("Form deleted");
            queryClient.invalidateQueries({
              queryKey: ["all forms"],
            });
          })
          .catch((e: Error) => {
            toast.dismiss();
            toast.error("Error occured");
            console.log("errror deleting", e);
          });
      },
    },
  ];

  return (
    <div className="w-full rounded-lg shadow-md bg-[#F8FAFC]">
      <div className="bg-gradient-to-r from-indigo-500 to-pink-400 h-[10rem] rounded-tl-lg rounded-tr-lg"></div>
      <div className="p-3">
        <h4 className="text-lg font-medium">{name}</h4>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs font-light pr-4">Edited {updatedOn} ago</p>{" "}
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
              <Menu.Items className="absolute  w-40 rounded-lg shadow-md flex flex-col bg-white text-left">
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
  );
}

export default FormCard;
