import ErrorIcon from "@/public/icons/ErrorIcon";
import React from "react";

const UncompletedCard = () => {
  return (
    <div className="flex justify-between items-center p-5 shadow-sm rounded-md bg-white">
      <div className="flex gap-4 items-center">
        <div className="rounded-md bg-[#FFEBEC] flex items-center justify-center h-10 w-10">
          <ErrorIcon />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-[#0E121B] text-lg font-semibold">
            You have one uncompleted form
          </p>
          <p className="text-[#525866] text-sm ">
            Insert your status modal description here. It would look better as
            two lines of text.
          </p>
        </div>
      </div>
      <button className="bg-primary-green flex text-white text-sm px-4 py-2 hover:opacity-95 items-center gap-2 rounded-lg">
        Continue application
      </button>
    </div>
  );
};

export default UncompletedCard;
