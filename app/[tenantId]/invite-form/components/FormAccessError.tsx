import TopNav from "@/components/TopNav/ClientTopNav";
import FolderError from "@/public/icons/FolderError";
import { Button } from "@nextui-org/button";
import React from "react";

const FormAccessError = ({
  text,
  subtext,
  onClick,
  btnColor
}: {
  text: string;
  subtext?: string;
  onClick?: () => void;
  btnColor?: string;
}) => {

  return (
    <div className="w-full h-screen flex justify-center items-center bg-[#F1F5F9]">
      <TopNav />
      <div className="flex flex-col items-center w-[26rem]">
        <FolderError />
        <h1 className="text-[#0F172A] font-semibold text-xl text-center mt-4">{text}</h1>
        {subtext && <p className="mt-2 text-[#64748B] text-[16px] text-center">{subtext}</p>}
        <Button
              style={{
                backgroundColor: btnColor,
              }}
              onClick={onClick && onClick}
              className="mt-4  disabled:cursor-not-allowed text-white rounded-lg py-3 px-4"
              type="submit"
            >
              Continue to dashboard
            </Button>
      </div>
    </div>
  );
};

export default FormAccessError;
