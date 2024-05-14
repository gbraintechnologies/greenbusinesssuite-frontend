"use client";

//
import { useRouter } from "next/navigation";
import React from "react";

// icons
import ErrorIcon from "@/public/icons/ErrorIcon";

const UncompletedCard = ({ form }: any) => {
  const router = useRouter();
  return (
    <div className="flex justify-between items-center p-5 shadow-sm rounded-md bg-white">
      <div className="flex  gap-4 items-center">
        <div className="rounded-md bg-[#FFEBEC] flex items-center justify-center h-10 w-10">
          <ErrorIcon />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-[#0E121B] text-sm md:text-lg font-semibold">
            {form?.name}
          </p>
          <p className="text-[#525866] text-xs md:text-sm ">
            You have an uncompleted form
          </p>
        </div>
      </div>
      <button
        onClick={() => {
          router.push(`/client/form?id=${form?.id}&company=Amazon`);
        }}
        className="bg-primary-green flex text-white text-xs md:text-sm px-4 py-2 hover:opacity-95 items-center gap-2 rounded-lg"
      >
        Continue filling form
      </button>
    </div>
  );
};

export default UncompletedCard;
