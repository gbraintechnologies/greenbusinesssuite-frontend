import React from "react";

import { IoIosArrowForward } from "react-icons/io";

function StepsNav({
  form,
  activeSection,
  setActiveSection,
  handleClickScroll,
}: any) {
  let sections = form?.formSections;

  return (
    <div>
      <p className="font-light text-gray-600 text-sm">FORM STEPS</p>

      <div className="flex flex-col gap-4 mt-5">
        {sections
          ?.filter((item: any) => !item.isDeleted)
          .map((section: any, idx: any) => {
            return (
              <button
                onClick={() => {
                  setActiveSection(section);
                  handleClickScroll(section?.id);
                }}
                className={`${
                  activeSection?.id === section?.id ? "bg-white" : ""
                }  px-3 py-3 rounded-xl flex items-center justify-between`}
                key={section.id}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`${
                      activeSection?.id === section?.id
                        ? "bg-[#f6f6f6]"
                        : "bg-[#cbd0d7]"
                    } w-7 h-7 text-xs rounded-full flex items-center justify-center font-light `}
                  >
                    {idx + 1}
                  </div>
                  <p className="text-base text-left">
                    {section?.name ? section?.name : "Section"}
                  </p>
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
