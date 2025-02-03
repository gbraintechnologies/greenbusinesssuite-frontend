"use client";

import React from "react";

import Link from "next/link";
import useCompany from "@/hooks/useCompany";
import { isRecordComplete } from "@/utils/isRecordComplete/isRecordComplete";

const ProfileCard = ({ profile }: { profile: any }) => {
  const { companyBranding: company } = useCompany();

  console.log("profile", profile);

  return (
    <div className="border border-[#E2E8F0] rounded-xl">
      <div className="px-8 flex justify-between items-start border-b border-[#E2E8F0] py-4">
        <div></div>
        <div className="flex mx-auto text-center flex-col gap-2">
          <h1 className="text-slate-900 font-semibold text-xl">Your Profile</h1>
          {/* <span
            className={`px-3 py-1 rounded-full text-sm font-medium bg-[#FEF2F2] text-[#DC2626] border border-[#DC2626]`}
          >
            Getting Started
          </span> */}
        </div>
        {/* <div>
          <IoIosHelpCircleOutline color="#94A3B8" size={20} />
        </div> */}
      </div>
      <div className="bg-[#F8FAFC] flex flex-col gap-1 text-center mx-auto p-4 border-b border-[#E2E8F0]">
        <h1 className="text-slate-900 font-medium text-base mb-2">
          Profile Completeness
        </h1>
        <div className="mx-auto w-[50%]">
          {!!profile &&
          isRecordComplete(profile[0], [
            "socialMediaLink",
            "tin",
            "completed",
          ]) ? (
            <p className="bg-green-100 rounded-full border-green-600 border px-5 p-1 text-sm text-green-700 mt-2">
              Complete
            </p>
          ) : (
            <p className="bg-red-100 rounded-full border-red-600 border p-1 text-sm text-red-700 mt-2">
              Incomplete
            </p>
          )}
        </div>
        {/* <Progress
          aria-label="Loading..."
          className="max-w-md"
          value={15}
          size="sm"
          classNames={{
            base: "max-w-md",
            track: "bg-[#CBD5E1]",
            indicator: "bg-[#16A34A]",
          }}
        /> */}
      </div>
      {!!profile &&
      isRecordComplete(profile[0], ["socialMediaLink", "tin", "completed"]) ? (
        <></>
      ) : (
        <div className="bg-[#F8FAFC] p-4 ">
          <div className="w-full">
            <Link
              href={`/${company?.company_identifier}/client/settings/business-profile`}
              className="disabled:bg-gray-400 w-full bg-[#15803D] py-3 flex text-white justify-center text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
            >
              Update Profile
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
