import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect } from "react";

import { LuFilter } from "react-icons/lu";
import { CiSquareCheck } from "react-icons/ci";
import { FaRegSquareCheck } from "react-icons/fa6";

type Props = {
  selected: any;
  setSelected: any;
  handleSelectAll: any;
  setPage: any;
};
export default function RecurringTypeFilter({
  selected,
  setSelected,
  setPage,
  handleSelectAll,
}: Props) {
  const recurringTypes: any = [
    {
      label: "All",
      value: "ALL",
    },
    {
      label: "Non-recurring",
      value: "NON_RECURRING",
    },
    {
      label: "Daily",
      value: "DAILY",
    },
    {
      label: "Weekly",
      value: "WEEKLY",
    },
    {
      label: "Bi-weekly",
      value: "BI_WEEKLY",
    },
    {
      label: "Monthly",
      value: "MONTHLY",
    },
    {
      label: "Quarterly",
      value: "QUARTERLY",
    },
    {
      label: "Annually",
      value: "ANNUAL",
    },
  ];

  return (
    <>
      <Menu as="div" className="z-10 relative inline-block text-left">
        <Menu.Button className="flex items-center gap-2 text-sm text-[#334155] border border-gray-200 rounded-lg font-medium px-3 py-2 ">
          <LuFilter size={16} color="#334155" />{" "}
          <>
            Filter{" "}
            {recurringTypes?.find((type: any) => type.value == selected)?.label || "All"}
          </>
        </Menu.Button>

        <div className="relative">
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              static
              className=" absolute bg-white shadow-lg border-gray-200 px-4 border top-3 right-0 rounded-xl p-2 w-56 z-[400]"
            >
              {recurringTypes?.map((recurringType: any, idx: any) => {
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setPage(0);
                      if (recurringType?.value === "ALL") {
                        handleSelectAll();
                        setSelected(null);
                        return;
                      }
                      setSelected(recurringType?.value);
                    }}
                    className="w-full flex items-center gap-2 py-2 text-sm"
                  >
                    {Boolean(
                      selected === recurringType?.value ||
                        ((selected === null ||
                          typeof selected == "undefined") &&
                          recurringType?.value === "ALL")
                    ) ? (
                      <FaRegSquareCheck
                        className="text-primary-green"
                        size={18}
                      />
                    ) : (
                      <CiSquareCheck className="text-gray-400" size={20} />
                    )}

                    {recurringType?.label}
                  </button>
                );
              })}
            </Menu.Items>
          </Transition>
        </div>
      </Menu>
    </>
  );
}
