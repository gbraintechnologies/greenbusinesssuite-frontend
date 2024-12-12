import React from "react";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { Progress } from "@nextui-org/progress";

const ProfileCard = () => {
  return (
    <div className="border border-[#E2E8F0] rounded-lg ">
      <div className="px-8 flex justify-between items-start border-b border-[#E2E8F0] py-4">
        <div></div>
        <div className="flex flex-col gap-2">
          <h1 className="text-slate-900 font-semibold text-xl">Your Profile</h1>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium bg-[#FEF2F2] text-[#DC2626] border border-[#DC2626]`}
          >
            Getting Started
          </span>
        </div>
        <div>
          <IoIosHelpCircleOutline color="#94A3B8" size={20} />
        </div>
      </div>
      <div className="bg-[#F8FAFC] p-4 border-b border-[#E2E8F0]">
        <h1 className="text-slate-900 font-medium text-base mb-2">
          Profile Incomplete
        </h1>
        <Progress
          aria-label="Loading..."
          className="max-w-md"
          value={15}
          size="sm"
          classNames={{
            base: "max-w-md",
            track: "bg-[#CBD5E1]",
            indicator: "bg-[#16A34A]",
          }}
        />
      </div>
      <div className="bg-[#F8FAFC] p-4 ">
        <div className="w-full">
          <button className="disabled:bg-gray-400 w-full bg-[#15803D] py-3 flex text-white justify-center text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl">
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
