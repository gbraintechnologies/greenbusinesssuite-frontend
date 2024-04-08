"use client";

import React from "react";

import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

// icons
import { BsThreeDots } from "react-icons/bs";
import { useRouter } from "next/navigation";

//
import { useQueryClient } from "@tanstack/react-query";

import FormPreviewIcon from "@/public/icons/FormPreviewIcon";

// utils
import FormatDate from "@/utils/FormatDate/FormatDate";

// components
import Modal from "@/components/Modal/Modal";
import DeleteForm from "../actions/DeleteForm";
import toast from "react-hot-toast";
import RenameForm from "../actions/RenameForm";
import services from "@/services";

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

  // modal controls for delete and rename
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);

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
        navigator.clipboard.writeText(url ?? "").then(() => {
          toast.success("Link copied!");
        });
      },
    },
    {
      title: "Rename",
      func: () => {
        setShowRenameModal(true);
      },
    },
    {
      title: "Duplicate",
      func: () => {
        toast.loading("Duplicating form");
        services
          .duplicateForm(id)
          .then((res) => {
            toast.dismiss();
            queryClient.invalidateQueries({
              queryKey: ["all forms"],
            });
            console.log("duplicated", res);
            // Push to builder after duplicating
            //  router.push(`/forms/builder/${res}`);
          })
          .catch((e) => {
            toast.dismiss();
            console.log("e dyupl", e);
            toast.error("Error duplicating form");
          });
      },
    },
    {
      title: "Delete",
      func: () => {
        setShowDeleteModal(true);
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

  return (
    <>
      <div className="w-full rounded-lg shadow-md bg-[#F8FAFC]">
        <button
          onClick={() => {
            router.push(`/forms/${id}`);
          }}
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
          <button
            onClick={() => {
              router.push(`/forms/${id}`);
            }}
            className="text-lg w-full text-left font-medium"
          >
            {name.replace(/"/g, " ")}
          </button>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs font-light pr-4">
              Edited {FormatDate(updatedOn)}
            </p>{" "}
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

      {/* DELETE FORM MODAL */}
      <Modal
        isOpen={showDeleteModal}
        setIsOpen={setShowDeleteModal}
        title={`Are you sure you want to delete "${name} form" ? `}
      >
        <DeleteForm id={id} setShow={setShowDeleteModal} />
      </Modal>

      {/* Rename Modal */}
      <Modal
        isOpen={showRenameModal}
        setIsOpen={setShowRenameModal}
        title={`Rename "${name} form"`}
      >
        <RenameForm form={form} setShow={setShowRenameModal} />
      </Modal>
    </>
  );
}

export default FormCard;
