"use client";

import React, { Fragment } from "react";

//
import { BsChevronDown, BsCheck } from "react-icons/bs";
import { Combobox, Transition } from "@headlessui/react";

// icons
import { FiSearch } from "react-icons/fi";
import { IoIosCloseCircle } from "react-icons/io";

export default function MultiComboSearch({
  data,
  placeholder = "Search and select users...",
  search,
  setSearch,
  sendToAllUsers = "false",
  selected,
  setSelected,
}: any) {
  //
  return (
    <Combobox
      disabled={sendToAllUsers}
      value={selected}
      // onChange={setSelected}
      nullable
    >
      <div className="relative w-full">
        <div className="flex px-2 disabled:cursor-not-allowed cursor-pointer rounded-lg text-sm items-center bg-white link2 text-neutral-700 border min-h-10  h-full">
          <FiSearch size={18} className="mr-3" />

          <Combobox.Input
            placeholder={placeholder}
            className="h-full w-full outline-none text-sm focus:outline-none input-custom"
            // @ts-ignore
            displayValue={(user) => user?.email}
            // @ts-ignore
            onChange={(event) => setSearch(event.target.value)}
          />
          <Combobox.Button className="absolute z-50 inset-y-0 right-0 flex items-center gap-2 pr-2">
            <BsChevronDown
              className="h-4 w-4 cursor-pointer text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>
        </div>
        {selected?.length > 0 && (
          <div className="text-sm mt-3">
            <div className="font-medium text-gray-500 mb-3">
              Selected Recipients:
            </div>
            <div className="grid grid-cols-4 gap-4">
              {selected.map((single: any) => {
                return (
                  <span className="border border-gray-200 p-1 px-3 rounded-lg justify-between flex gap-1 items-center">
                    {single?.first_name} {single?.last_name}
                    <IoIosCloseCircle
                      size={5}
                      color="#DC2626"
                      onClick={() => {
                        setSelected(
                          selected.filter((item: any) => item.id !== single.id)
                        );
                      }}
                      className="h-5 w-5 text-gray-400 cursor-pointer hover:scale-105"
                      aria-hidden="true"
                    />
                  </span>
                );
              })}
            </div>
          </div>
        )}
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          // @ts-ignore
          afterLeave={() => setSearch("")}
        >
          <Combobox.Options className="absolute z-[999999999999999] mt-1 max-h-60 w-full overflow-auto rounded-md py-1  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none bg-white ">
            {data?.length === 0 && search !== "" ? (
              <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                No users found.
              </div>
            ) : (
              data?.map((user: any) => (
                <Combobox.Option
                  onClick={() => {
                    if (selected?.length > 0) {
                      setSelected(() => [...selected, user]);
                    } else {
                      setSelected(() => [user]);
                    }
                  }}
                  key={user?.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 text-gray-900`
                  }
                  value={user}
                >
                  {({ selected, active }) => (
                    <button>
                      <span
                        className={`truncate paragraph text-sm  flex gap-3 items-center ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {user?.first_name} {user?.last_name}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? "text-white" : "text-brand-600"
                          }`}
                        >
                          <BsCheck className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </button>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
}
