"use client";

import React, { useEffect } from "react";

import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

// icons
import { BsThreeDots } from "react-icons/bs";
import { useRouter } from "next/navigation";

//
import { useQueryClient } from "@tanstack/react-query";

import FormPreviewIcon from "@/public/icons/FormPreviewIcon";

// utils
import FormatDate, {
  FormatDateShort,
  FormatDateWithDayShort,
} from "@/utils/FormatDate/FormatDate";

// components
import Modal from "@/components/Modal/Modal";
import DeleteForm from "../actions/DeleteForm";
import { toast } from "sonner";
import RenameForm from "../actions/RenameForm";
import services from "@/services";
import { IoLockClosedOutline, IoLockOpenOutline } from "react-icons/io5";
import { PiEye, PiEyeSlash, PiNotePencilBold } from "react-icons/pi";

type Props = {
  form: any;
  addFormResponses?: boolean;
  onClick?: () => void;
};
function FormCard({ form, onClick, addFormResponses = false }: Props) {
  let { id, name, updatedOn, url, publishStatus, isAnonymous } = form;

  const router = useRouter();
  const queryClient = useQueryClient();

  // modal controls for delete and rename
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);

  const [formResponsesCount, setFormResponsesCount] = useState(0);

  const options = [
    {
      title: addFormResponses ? "Preview Forms" : "Open Builder",
      func: () => {
        addFormResponses
          ? router.push("/company/forms")
          : router.push(`/forms/builder/${id}`);
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
        toast.info("Duplicating form");
        services
          .duplicateForm(id)
          .then((res) => {
            toast.dismiss();
            queryClient.invalidateQueries({
              queryKey: ["all forms"],
            });

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

  const getFormResponses = async () => {
    const responses = await services.getFormResponsesById(id);
    setFormResponsesCount(responses.data?.length);
  };

  useEffect(() => {
    if (addFormResponses) {
      getFormResponses();
    }
  }, []);

  // TODO: HARD DELETE
  const hardDelete = (id: any) => {
    toast.info("Deleting");
    services
      .hardDeleteForm(id)
      .then((res) => {
        toast.dismiss();
        console.log("res", res.data);
        toast.success(res.data);
        queryClient.invalidateQueries({
          queryKey: ["all forms"],
        });
      })
      .catch((e) => {
        toast.dismiss();
        // toast.error(e?.response?.data);
        console.log("delete error", e?.response?.data);
      });
  };

  return (
    <>
      <div className="w-full rounded-lg shadow-md bg-[#F8FAFC]">
        {/* <button
          onClick={() => hardDelete(id)}
          className="bg-red-700 px-5 py-5 m-5 text-white"
        >
          Delete
        </button> */}
        <button
          onClick={
            onClick
              ? () => onClick()
              : () => {
                  router.push(`/forms/${id}`);
                }
          }
          className={`flex relative  bg-gradient-to-br from-indigo-950 to bg-gray-900  w-full h-[10rem] rounded-tl-lg rounded-tr-lg`}
        >
          <div className="opacity-10 absolute scale-150 top-[35%] left-[35%]">
            <FormPreviewIcon />
          </div>
          <div className=" text-xs my-2 absolute top-2 left-4 flex flex-col items-start justify-start gap-2">
            {isAnonymous ? (
              <span className="rounded-full text-white bg-orange-600 font-medium   py-1 px-4 flex items-center gap-1 w-fit">
                <IoLockOpenOutline /> Public
              </span>
            ) : (
              <span className="rounded-full text-white bg-indigo-600 font-medium   py-1 px-4 flex items-center gap-1 w-fit">
                <IoLockClosedOutline /> Protected
              </span>
            )}
            <span>
              {form?.multipleForms && (
                <span className="rounded-full truncate text-white bg-fuchsia-600 font-normal py-1 px-4 flex items-center gap-1 w-fit">
                  <PiNotePencilBold /> Allows Multiple Responses
                </span>
              )}
            </span>
          </div>
        </button>
        <div className="p-3">
          <button
            onClick={() => {
              router.push(`/forms/${id}`);
            }}
            className="text-lg w-full text-left font-medium"
          >
            {name?.replace(/"/g, " ")}
          </button>
          <div className="my-2 flex items-center gap-3 text-xs">
            {/* ANONYMOUS */}
            {/* <span>
              {isAnonymous ? (
                <span className="rounded-full text-orange-600 bg-orange-600 font-medium bg-opacity-10  py-1 px-4 flex items-center gap-1 w-fit">
                  <IoLockOpenOutline /> Public
                </span>
              ) : (
                <span className="rounded-full text-indigo-600 bg-indigo-600 font-medium bg-opacity-10  py-1 px-4 flex items-center gap-1 w-fit">
                  <IoLockClosedOutline /> Protected
                </span>
              )}
            </span> */}
            {/* PUBLISHED STATUS */}
            {/* <span>
                {publishStatus.toLowerCase() == "published" ? (
                  <span className="rounded-full text-green-600 bg-green-600 font-medium bg-opacity-10  py-1 px-4 flex items-center gap-1 w-fit">
                    <PiEye /> Published
                  </span>
                ) : (
                  <span className="rounded-full text-red-600 bg-red-600 font-medium bg-opacity-10  py-1 px-4 flex items-center gap-1 w-fit">
                    <PiEyeSlash /> Unpublished
                  </span>
                )}
              </span> */}
          </div>
          <div className="flex items-center justify-between mt-1">
            {addFormResponses ? (
              <p className="text-xs pr-4">
                <span className="font-bold ">{formResponsesCount}</span>{" "}
                responses
              </p>
            ) : (
              <p className="text-xs font-light pr-4">
                Edited {FormatDateWithDayShort(updatedOn)}
              </p>
            )}
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
                <Menu.Items className="absolute z-[99999999]  w-40 right-1 -top-1 rounded-lg shadow-md flex flex-col bg-white text-left">
                  {options.map((option: any, idx: any) => {
                    return (
                      <Menu.Item key={idx}>
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
