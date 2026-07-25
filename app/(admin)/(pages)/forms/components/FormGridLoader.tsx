import React from "react";

import FormPreviewIcon from "@/public/icons/FormPreviewIcon";

function FormGridLoader() {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
      <SingleLoader />
      <SingleLoader />
      <SingleLoader />
      <SingleLoader />
      <SingleLoader />
      <SingleLoader />
      <SingleLoader />
      <SingleLoader />
    </div>
  );
}

const SingleLoader = () => {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white sm:rounded-lg sm:border-0 sm:bg-[#F8FAFC]">
      <button className="flex h-24 w-full items-center justify-center rounded-t-xl bg-gray-400 sm:h-[10rem] sm:rounded-tl-lg sm:rounded-tr-lg">
        <FormPreviewIcon />
      </button>
      <div className="h-16 rounded-b-xl bg-gray-200 p-2.5 sm:h-20 sm:p-3">
        <div className="h-4 w-full animate-pulse rounded-lg bg-gray-400 sm:h-5" />
        <div className="mt-2 h-2.5 w-[60%] animate-pulse rounded-lg bg-gray-400 sm:h-3" />
      </div>
    </div>
  );
};

export default FormGridLoader;
