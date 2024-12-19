"use client";

//
import { useRouter } from "next/navigation";
import React from "react";

// icons
import ErrorIcon from "@/public/icons/ErrorIcon";
import CompanyThemedButton from "@/components/Buttons/CompanyThemedButton";
import useAuth from "@/hooks/useAuth";

const UncompletedCard = ({ form }: any) => {
  const router = useRouter();

  const { auth } = useAuth();
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
            You have an incomplete application
          </p>
        </div>
      </div>
      <CompanyThemedButton
        onClick={() => {
          router.push(
            `/${auth?.tenantId}/client/form?id=${form?.id}&company=${form?.companyId}`
          );
        }}
        className="bg-black flex text-white text-xs md:text-sm px-4 py-2 hover:opacity-95 items-center gap-2 rounded-lg"
      >
        Continue filling form
      </CompanyThemedButton>
    </div>
  );
};

export default UncompletedCard;
