"use client";
import Logo from "@/app/(admin)/auth/(login)/components/Logo";
import React from "react";
import { AiOutlineClose } from "react-icons/ai";

function Deactivated({
  reason = "This account has been deactivated.",
  title = "Account deactivated",
}: any) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1 items-center justify-center py-8 mt-16">
        <div className="flex flex-col items-center text-center">
          <div className="relative w-[240px] h-[240px] mb-10 flex items-center justify-center rounded-full">
            <div className="absolute inset-[-16px] border-2 border-[#f08080] rounded-full"></div>
            <div className="absolute inset-[16px] border-2 border-[#d53d32] rounded-full"></div>
            <div className="relative w-[160px] h-[160px] flex items-center justify-center rounded-full bg-[#d53d32]">
              <AiOutlineClose className="w-16 h-16 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold mb-4">{title}</p>
          <div className="space-y-2">
            <p className="text-sm text-opacity-30 w-72 text-black font-medium">
              {reason} <br /> Please contact your administrator to restore
              access
            </p>
            {/* <p className="text-sm text-opacity-30 text-black font-medium">
              company admin at&nbsp;
              <span className="font-bold text-black">
                kpmgadmin@kmpghana.com
              </span>
            </p> */}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center text-xs text-opacity-30 text-black font-medium mb-4">
          <p>Powered By&nbsp;&nbsp;&nbsp;</p>
          <Logo src={"/svg/mesh_logo.svg"} width={100} />
        </div>
        <div className="flex items-center gap-x-2 text-xs text-opacity-30 text-black font-medium">
          <p className="font-xs">&copy;&nbsp;Mesh Business</p>
          <p>&bull;&nbsp;Contact</p>
          <p>&bull;&nbsp;Privacy policy</p>
        </div>
      </div>
    </div>
  );
}

export default Deactivated;
