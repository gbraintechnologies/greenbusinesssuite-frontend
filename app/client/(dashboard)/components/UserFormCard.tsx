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

import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import useUser from "@/hooks/useUser";
import services from "@/services";

type Props = {
  form: any;
  onClick?: () => void;
  type: "completed" | "uncompleted";
};
function FormCard({ form, type = "uncompleted" }: Props) {
  //
  let { id, updatedOn } = form;

  const { user } = useUser();

  const queryClient = useQueryClient();

  const router = useRouter();

  const completedOptions = [
    {
      title: "View",
      func: () => {
        router.push(`/client/form?id=${form?.id}`);
      },
    },
    {
      title: "Download",
      func: () => {
        //

        toast.success("File would be downloaded");
      },
    },
  ];

  const uncompletedOptions = [
    {
      title: "Continue editing",
      func: () => {
        router.push(`/client/form?id=${form?.id}&company=${form.companyName}`);
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

  const [options, setOptions] = useState(null);

  useEffect(() => {
    if (type === "completed") {
      // @ts-ignore
      setOptions(completedOptions);
    } else {
      // @ts-ignore
      setOptions(uncompletedOptions);
    }
  }, []);

  const deleteUserForm = () => {
    services
      .hardDeleteUserForm(user?.id, id)
      .then((res) => {
        console.log("user form deleted");
        toast.success("deleted");
      })
      .catch((e) => {
        console.log("error", e);
      });
  };

  return (
    <>
      <div className="w-full rounded-lg shadow-md bg-[#F8FAFC]">
        {/* <button
          className="my-4 bg-red-500 text-white rounded-lg"
          onClick={deleteUserForm}
        >
          Delete
        </button> */}
        <button
          className={`flex items-center bg-gradient-to-br from-indigo-950 to bg-gray-900 justify-center w-full h-[10rem] rounded-tl-lg rounded-tr-lg`}
        >
          <FormPreviewIcon />
        </button>
        <div className="p-3">
          <button className="text-lg w-full text-left font-medium">
            {/* @ts-ignore */}
            {form?.name?.replace(/"/g, " ")}
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

export default FormCard;
