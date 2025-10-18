"use client";

import React from "react";
import { GrInbox } from "react-icons/gr";

function NoDataIndicator({
  text = "No data exists",
  title = "No data",
  icon,
}: {
  text?: string;
  title?: string;
  icon?: any;
}) {
  return (
    <div className="w-full border border-gray-300 rounded-xl border-dashed py-10 min-h-[30vh] flex items-center justify-center gap-2 flex-col my-10">
      <div className="bg-nmi-light-green bg-opacity-10 py-3 px-10 text-nmi-light-green rounded-xl flex items-center justify-center">
        {icon ? icon : <GrInbox size={50} />}
      </div>
      <h4 className="mt-3 text-center text-3xl md:text-4xl text-gray-600 font-semibold">
        {title}
      </h4>
      <p className="text-gray-500 text-sm font-light">{text}</p>
    </div>
  );
}

export default NoDataIndicator;
