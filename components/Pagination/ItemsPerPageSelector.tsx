import React from "react";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";

// icons
import { BsChevronDown } from "react-icons/bs";
import { FaCheck } from "react-icons/fa6";

function ItemsPerPageSelector({ limit = 10, setLimit }: any) {
  //
  const limitValues = [10, 25, 50, 75, 100];

  //
  return (
    <div className="flex text-sm items-center gap-2 text-slate-500">
      Items per page{" "}
      <Dropdown
        showArrow
        classNames={{
          base: "before:bg-default-200",
          content: "w-20 border border-default-200 px-1 py-1",
        }}
        size="sm"
        className="w-20"
        shouldBlockScroll={false}
      >
        <DropdownTrigger>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 outline-none"
          >
            <span>{limit}</span>
            <BsChevronDown color="#94A3B8" />
          </button>
        </DropdownTrigger>
        <DropdownMenu
          className=" rounded-lg flex flex-col gap-3"
          aria-label="Static Actions"
        >
          {limitValues.map((limitValue, idx) => (
            <DropdownItem
              key={idx}
              className="items-center w-full p-2 rounded-md text-sm font-medium hover:bg-[#F1F5F9]"
              onClick={() => setLimit(limitValue)}
            >
              <div className="w-full flex items-center justify-between">
                <p>{limitValue}</p>
                {limitValue == limit && (
                  <span className="">
                    <FaCheck size={16} className="text-gray-500" />
                  </span>
                )}
              </div>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}

export default ItemsPerPageSelector;
