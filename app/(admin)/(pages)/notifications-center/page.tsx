import Link from "next/link";
import React from "react";
import { TbMessage } from "react-icons/tb";

function page() {
  return (
    <div className="px-5 pb-10">
      <h3 className="font-semibold mb-8 text-xl">Notifications Center</h3>

      <div className="flex w-full justify-end mb-5">
        <Link href="/notifications-center/send-message">
          <button className=" bg-white text-[#334155] border border-[rgba(226, 232, 240, 1)] w-auto flex text-sm px-2 font-medium py-2 hover:opacity-95 items-center justify-center gap-2 rounded-lg ">
            <TbMessage color={"#334155"} size={20} />
            Send Message
          </button>
        </Link>
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
