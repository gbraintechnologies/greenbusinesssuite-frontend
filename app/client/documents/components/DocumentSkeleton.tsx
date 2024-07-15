import React from "react";

function DocumentSkeleton() {
  return (
    <div className="w-full rounded-lg bg-[#F8FAFC]">
      <button
        className={`flex items-center bg-gray-400  justify-center w-full h-[8rem] rounded-tl-lg rounded-tr-lg`}
      >
        <></>
      </button>
      <div className="p-3 h-16 bg-gray-200 rounded-b-xl ">
        <div className=" w-full text-left font-medium h-4 rounded-lg bg-gray-400 animate-pulse" />
        <div className=" w-[60%] text-left font-medium h-2 mt-2 rounded-lg bg-gray-400 animate-pulse" />
      </div>
    </div>
  );
}

export default DocumentSkeleton;
