import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

import { LuFilter } from "react-icons/lu";
import { CiSquareCheck } from "react-icons/ci";
import { FaRegSquareCheck } from "react-icons/fa6";

export default function RoleFilter({ selected, setSelected, roles }: any) {
  const addToSelectedRoles = (role: any) => {
    if (
      Boolean(selected.find((item: any) => item.role_name === role.role_name))
    ) {
      // already in so remove
      setSelected(
        selected.filter((item: any) => item.role_name !== role.role_name)
      );
    } else {
      // add
      setSelected((prev: any) => [...prev, role]);
    }
  };

  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="flex items-center gap-2 text-sm text-gray-500 border border-gray-200 rounded-xl px-3 py-2 ">
          <LuFilter size={16} /> Filter
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
              className=" absolute bg-white shadow-lg border-gray-200 px-4 border top-12 right-0 rounded-xl p-2 w-56 z-[400]"
            >
              {roles &&
                roles?.map((role: any, idx: any) => {
                  return (
                    <button
                      key={idx}
                      onClick={() => addToSelectedRoles(role)}
                      className="w-full flex items-center gap-2 py-2 text-sm"
                    >
                      {Boolean(
                        selected.find(
                          (item: any) => item.role_name === role.role_name
                        )
                      ) ? (
                        <FaRegSquareCheck
                          className="text-primary-green"
                          size={18}
                        />
                      ) : (
                        <CiSquareCheck className="text-gray-400" size={20} />
                      )}

                      {role.role_name}
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
