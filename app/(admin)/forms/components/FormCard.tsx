"use client";

import React from "react";

import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";

// icons
import { BsThreeDots } from "react-icons/bs";
import { useRouter } from "next/navigation";

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
                      <button
                        className="py-3 tex-gray-500 px-4 font-light hover:bg-gray-100 text-left"
                        onClick={() => option.func()}
                      >
                        {option.title}
                      </button>
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
