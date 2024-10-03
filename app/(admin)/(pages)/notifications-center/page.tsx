import Link from "next/link";
import React from "react";
import { TbMessage } from "react-icons/tb";
import SendMessage from "./_components/SendMessagePrompt";

function page() {
  return (
    <div className="px-5 pb-10">
      <h3 className="font-semibold mb-8 text-xl">Notifications Center</h3>

      <div className="flex w-full justify-end mb-5">
        <SendMessage />
      </div>

      <div>
        <div className="border border-dashed min-h-[30vh] text-gray-500 rounded-xl text-center flex items-center justify-center">
          Tabs and message history here
        </div>
      </div>
    </div>
  );
}

export default page;
