import React from "react";

import { IoIosArrowForward } from "react-icons/io";

function StepsNav({ form }: any) {
  let sections = form?.formSections;
  return (
    <div>
      <p className="font-light text-gray-600 text-sm">FORM STEPS</p>

      <div className="flex flex-col gap-4 mt-5">
        {sections?.map((section: any, idx: any) => {
          return (
            <button
              className=" hover:bg-[#cbd0d775] px-1 py-2 rounded-xl flex items-center justify-between"
              key={section.id}
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 text-xs rounded-full flex items-center justify-center font-light bg-[#cbd0d7]">
                  {idx}
                </div>
                <p className="text-base">{section.name}</p>
              </div>
              <IoIosArrowForward />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default StepsNav;
