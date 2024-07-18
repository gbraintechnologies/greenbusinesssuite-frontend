"use client";

import React, { useEffect } from "react";

import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

// icons
import { BsThreeDots } from "react-icons/bs";

import { IoDocumentAttachOutline } from "react-icons/io5";

// utils
import FormatDate from "@/utils/FormatDate/FormatDate";

import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

import {
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
} from "@nextui-org/modal";

//
import services from "@/services";

// components
import { startWithCapital } from "@/utils/Capitalize/startWithCapital";
import DocumentViewer from "./DocumentViewer";

function DocumentCard({ document }: any) {
  //
  let { id, fileName, createdOn, url, formId } = document;

  //
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // console.log("document", document);

  const queryClient = useQueryClient();

  const handleDownload = (url: string, fileName: string) => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const url =
          typeof window !== "undefined" &&
          window.URL.createObjectURL(new Blob([blob]));

        const link = document.createElement("a");
        link.href = url;
        link.download = fileName || "downloaded-file";
        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
        if (typeof window !== "undefined") {
          // @ts-ignore
          window.URL.revokeObjectURL(url);
        }
      })
      .catch((error) => {
        console.error("Error fetching the file:", error);
        toast.error("Error occured downloading file");
      });
  };

  const options = [
    {
      title: "View",
      func: () => {
        onOpen();
      },
    },
    {
      title: "Download",
      func: () => {
        handleDownload(url, fileName);
      },
    },
  ];

  return (
    <>
      <div className="w-full rounded-lg shadow-md bg-[#F8FAFC]">
        <button
          className={`flex items-center bg-gradient-to-br from-[#FFCAD4] to bg-[#FEA7B7] justify-center w-full  rounded-tl-lg rounded-tr-lg`}
        >
          <div className="m-2 my-10 px-4 py-2 flex items-center justify-center  rounded-lg bg-white">
            {/* ADD TYPE OF FILE: UPLOAD / ISSUE */}
            <IoDocumentAttachOutline className="text-gray-600" size={30} />
          </div>
        </button>
        <div className="p-3">
          <button className="text-base w-full text-left font-medium">
            {startWithCapital(fileName?.split(".")[0])}
          </button>
          <div className="flex items-center justify-between mt-1">
            {/* TODO: FORM NAME HERE Fetch form using formID */}
            {/* UPDATE PREVIEW TO IGNORE UPLOAD ELEMENT */}
            {/* UPDATE CLIENT TO ALSO IGNORE UPLOAD */}
            <p className="text-xs font-light pr-4">{FormatDate(createdOn)}</p>
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
                <Menu.Items className="absolute z-50  w-40 right-1 -top-1 rounded-lg shadow-md flex flex-col bg-white text-left">
                  {options &&
                    // @ts-ignore
                    options?.map((option: any, idx: any) => {
                      return (
                        <Menu.Item>
                          <button
                            className={`${
                              option.title.toLowerCase() === "delete"
                                ? "text-red-600"
                                : " text-gray-500"
                            } py-3  px-4 font-light hover:bg-gray-50 cursor text-left w-full`}
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

      {/* Viewing DOCUMENT */}
      <Modal
        size="full"
        backdrop="opaque"
        className="bg-white rounded-lg p-5"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          backdrop: "bg-black bg-opacity-20 backdrop-opacity-20",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <DocumentViewer
                  url={url}
                  fileName={fileName}
                  onClose={onClose}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default DocumentCard;
