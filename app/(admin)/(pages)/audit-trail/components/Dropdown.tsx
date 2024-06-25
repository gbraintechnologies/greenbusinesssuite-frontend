import React, { Fragment } from "react";

import Select from "react-select";

//
import "../index.css";
import { Listbox, Transition } from "@headlessui/react";
import { BiChevronDown } from "react-icons/bi";
import { FaCheck } from "react-icons/fa6";
import { BsChevronDown } from "react-icons/bs";

const Dropdown = ({
  options,
  selected,
  setSelected,
  labelName,
}: any) => (
  <Listbox value={selected} onChange={setSelected}>
    <div className="relative">
      <Listbox.Button className="flex relative justify-between items-center px-3 py-2 shadow-[0px_2px_8px_0px_rgba(100, 116, 139, 0.1)] bg-white border border-[#E2E8F0] w-64 rounded-lg">
        <span className="text-sm block truncate">{selected[labelName]}</span>
        <span className="">
          <BsChevronDown color="#94A3B8" />
        </span>
      </Listbox.Button>
      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      > 
        <Listbox.Options className="absolute mt-1 max-h-96 w-full overflow-auto z-[2000000] shadow-[0px_2px_8px_0px_rgba(100, 116, 139, 0.1)] bg-white border border-[#E2E8F0] rounded-lg">
          {options?.map((option: any, optionIdx: number) => (
            <Listbox.Option
              key={optionIdx}
              className={({ active, selected }) =>
                `relative cursor-pointer select-none flex justify-between items-center px-3 py-2 ${active ? "bg-[#F9FAFB]" : ""} `
              }
              value={option}
            >
              {() => {
                return (
                <>
                  <span
                    className={`block truncate ${selected ? "font-medium" : "font-normal"}`}
                  >
                    {option[labelName]}
                  </span>
                    {selected[labelName] === option[labelName] && <span className="">
                      <FaCheck className="h-5 w-5" color="black"/>
                    </span>}
                </>
              )}}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Transition>
    </div>
  </Listbox>
);

export default Dropdown;
