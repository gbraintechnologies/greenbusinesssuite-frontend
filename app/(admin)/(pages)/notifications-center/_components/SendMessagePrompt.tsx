"use client";

import Notifications from "@/app/(admin)/(pages)/notifications-center/_components/Notifications";
import { useRouter } from "next/navigation";
import React from "react";

// icons
import { IoIosArrowBack } from "react-icons/io";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";

//
import Link from "next/link";
import { TbMessage } from "react-icons/tb";

function SendMessage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();

  //
  return (
    <>
      <div className="flex items-center gap-3 px-5">
        <button
          onClick={() => onOpen()}
          className=" bg-white text-[#334155] border border-[rgba(226, 232, 240, 1)] w-auto flex text-sm px-2 font-medium py-2 hover:opacity-95 items-center justify-center gap-2 rounded-lg "
        >
          <TbMessage color={"#334155"} size={20} />
          Send Message
        </button>
      </div>

      <Modal
        backdrop="opaque"
        scrollBehavior="inside"
        className="bg-white rounded-xl"
        classNames={{
          backdrop: "bg-black bg-opacity-30",
        }}
        size="5xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent className="bg-white">
          {(onClose) => (
            <>
              <Notifications setShow={onOpen} />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default SendMessage;
