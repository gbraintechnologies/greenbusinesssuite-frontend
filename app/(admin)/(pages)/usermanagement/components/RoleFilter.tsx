import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

import { LuFilter } from "react-icons/lu";
import { CiSquareCheck } from "react-icons/ci";
import { FaRegSquareCheck } from "react-icons/fa6";

function asRoleList(roles: unknown) {
  if (Array.isArray(roles)) return roles;
  if (Array.isArray((roles as any)?.content)) return (roles as any).content;
  return [];
}

function asSelectedList(selected: unknown) {
  return Array.isArray(selected) ? selected : [];
}

export default function RoleFilter({ selected, setSelected, roles }: any) {
  const roleList = asRoleList(roles);
  const selectedList = asSelectedList(selected);

  const addToSelectedRoles = (role: any) => {
    if (
      Boolean(
        selectedList.find((item: any) => item.role_name === role.role_name)
      )
    ) {
      setSelected(
        selectedList.filter((item: any) => item.role_name !== role.role_name)
      );
    } else {
      setSelected((prev: any) => [...asSelectedList(prev), role]);
    }
  };

  return (
    <>
      <Menu as="div" className="relative z-10 inline-block text-left">
        <Menu.Button className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-500">
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
              className="absolute right-0 top-12 z-[400] w-56 rounded-xl border border-gray-200 bg-white p-2 px-4 shadow-lg"
            >
              {roleList.length === 0 ? (
                <p className="px-1 py-2 text-sm text-gray-400">No roles found</p>
              ) : (
                roleList.map((role: any, idx: number) => (
                  <button
                    key={role?.id ?? idx}
                    type="button"
                    onClick={() => addToSelectedRoles(role)}
                    className="flex w-full items-center gap-2 py-2 text-sm"
                  >
                    {Boolean(
                      selectedList.find(
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

                    {role.role_name || role.roleName}
                  </button>
                ))
              )}
            </Menu.Items>
          </Transition>
        </div>
      </Menu>
    </>
  );
}
