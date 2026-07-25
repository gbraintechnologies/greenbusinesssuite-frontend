"use client";

import React, { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { BsThreeDots } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import FormPreviewIcon from "@/public/icons/FormPreviewIcon";
import { FormatDateWithDayShort } from "@/utils/FormatDate/FormatDate";
import Modal from "@/components/Modal/Modal";
import DeleteForm from "../actions/DeleteForm";
import { toast } from "sonner";
import RenameForm from "../actions/RenameForm";
import services from "@/services";
import { IoLockClosedOutline, IoLockOpenOutline } from "react-icons/io5";
import { PiNotePencilBold } from "react-icons/pi";
import { capitalize } from "@/utils/Capitalize/capitalize";

type Props = {
  form: any;
  addFormResponses?: boolean;
  onClick?: () => void;
};

function FormCard({ form, onClick, addFormResponses = false }: Props) {
  const { id, name, updatedOn, url, publishStatus, isAnonymous } = form;

  const router = useRouter();
  const queryClient = useQueryClient();

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
          .then(() => {
            toast.dismiss();
            queryClient.invalidateQueries({
              queryKey: ["all forms"],
            });
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

  useEffect(() => {
    if (!addFormResponses) return;

    const getFormResponses = async () => {
      const responses = await services.getFormResponsesById(id);
      setFormResponsesCount(responses.data?.length);
    };

    getFormResponses();
  }, [addFormResponses, id]);

  return (
    <>
      <div className="relative z-0 w-full min-w-0 rounded-xl border border-slate-200 bg-white shadow-sm focus-within:z-50 sm:rounded-lg sm:border-0 sm:bg-[#F8FAFC] sm:shadow-md">
        <button
          type="button"
          onClick={
            onClick
              ? () => onClick()
              : () => {
                  router.push(`/forms/${id}`);
                }
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

        <div className="p-2.5 sm:p-3">
          <button
            type="button"
            onClick={() => {
              router.push(`/forms/${id}`);
            }}
            className="w-full truncate text-left text-sm font-semibold text-slate-900 sm:text-lg sm:font-medium"
          >
            {name?.replace(/"/g, " ")}
          </button>

          <div className="mt-1.5 flex items-center justify-between gap-1 sm:mt-1">
            {addFormResponses ? (
              <p className="truncate pr-2 text-[10px] text-slate-500 sm:pr-4 sm:text-xs">
                <span className="font-bold text-slate-700">
                  {formResponsesCount}
                </span>{" "}
                responses
              </p>
            ) : (
              <p className="truncate pr-2 text-[10px] font-light text-slate-500 sm:pr-4 sm:text-xs">
                Edited {FormatDateWithDayShort(updatedOn)}
              </p>
            )}

            <Menu as="div" className="relative shrink-0">
              <Menu.Button
                className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                aria-label="Form actions"
              >
                <BsThreeDots />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute bottom-full right-0 z-[100] mb-1 flex w-44 flex-col rounded-lg border border-slate-200 bg-white py-1 text-left shadow-lg">
                  {options.map((option, idx) => (
                    <Menu.Item key={idx}>
                      {({ close }) => (
                        <button
                          type="button"
                          className={`${
                            option.title.toLowerCase() === "delete"
                              ? "text-red-600 hover:bg-red-50"
                              : "text-gray-600 hover:bg-gray-50"
                          } w-full px-4 py-2.5 text-left text-sm`}
                          onClick={() => {
                            option.func();
                            close();
                          }}
                        >
                          {option.title}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showDeleteModal}
        setIsOpen={setShowDeleteModal}
        title={`Are you sure you want to delete "${name} form" ? `}
      >
        <DeleteForm id={id} setShow={setShowDeleteModal} />
      </Modal>

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
