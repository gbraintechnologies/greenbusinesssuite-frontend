"use client";

import Notifications from "@/app/(admin)/(pages)/notifications-center/_components/Notifications";
import React from "react";
import { Modal, ModalContent, useDisclosure } from "@heroui/modal";
import { TbMessage } from "react-icons/tb";

function SendMessage({
  type = "super-admin",
}: {
  type?: "super-admin" | "company-admin";
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <button
        type="button"
        onClick={() => onOpen()}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
      >
        <TbMessage size={18} />
        Send Message
      </button>

      <Modal
        backdrop="opaque"
        scrollBehavior="inside"
        className="rounded-xl bg-white"
        classNames={{
          backdrop: "bg-black bg-opacity-30",
        }}
        size="5xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent className="bg-white">
          {(onClose) => <Notifications type={type} onClose={onClose} />}
        </ModalContent>
      </Modal>
    </>
  );
}

export default SendMessage;
