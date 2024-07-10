import React from "react";

import FormPreviewIcon from "@/public/icons/FormPreviewIcon";

function FormGridLoader() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
    <div className="w-full rounded-lg bg-[#F8FAFC]">
      <button
        className={`flex items-center bg-gray-400  justify-center w-full h-[10rem] rounded-tl-lg rounded-tr-lg`}
      >
        <FormPreviewIcon />
      </button>
      <div className="p-3 h-20 bg-gray-200 rounded-b-xl ">
        <div className=" w-full text-left font-medium h-5 rounded-lg bg-gray-400 animate-pulse" />
        <div className=" w-[60%] text-left font-medium h-3 mt-2 rounded-lg bg-gray-400 animate-pulse" />
      </div>
    </div>
  );
};

export default FormGridLoader;
