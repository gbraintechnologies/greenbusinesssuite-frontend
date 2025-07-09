import React from "react";
import { PiEmpty } from "react-icons/pi";

const NoItems = ({
  headerText,
  subtext,
  icon,
}: {
  headerText?: string;
  subtext?: string;
  icon?: React.ReactNode;
}) => {
  return (
    <div className="w-full h-auto py-10 flex justify-center items-center flex-col">
      <div>{icon ? icon : <PiEmpty size={30} />}</div>
      <h1 className="text-lg font-medium">{headerText ?? "No items"}</h1>
      <p className="text-sm text-[#667085] text-center">
        {subtext ?? "There are no items"}
      </p>
    </div>
  );
};

export default NoItems;
