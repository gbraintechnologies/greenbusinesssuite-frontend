"use client";

import Notifications from "@/components/Notifications/Notifications";
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
} from "@nextui-org/modal";
import Link from "next/link";
import { TbMessage } from "react-icons/tb";

function SendMessage() {
  const router = useRouter();
  return (
    <div className="flex items-center gap-3 px-5">
      <Link href="/notifications-center/send-message">
        <button className=" bg-white text-[#334155] border border-[rgba(226, 232, 240, 1)] w-auto flex text-sm px-2 font-medium py-2 hover:opacity-95 items-center justify-center gap-2 rounded-lg ">
          <TbMessage color={"#334155"} size={20} />
          Send Message
        </button>
      </Link>

      {/* <Notifications setShow={null} /> */}
    </div>
  );
}

export default SendMessage;
