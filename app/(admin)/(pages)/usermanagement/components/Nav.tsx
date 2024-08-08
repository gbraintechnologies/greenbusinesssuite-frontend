"use client";

import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

// icons
import { LuPlusCircle } from "react-icons/lu";
import { IoIosArrowDown } from "react-icons/io";
import Link from "next/link";
import { Button } from "@nextui-org/button";

function Nav() {
  return (
    <div className="w-full text-[#0F172A] px-5 flex justify-between">
      <div>
        <h3 className="font-semibold text-xl">User Management</h3>
        <p className="font-light">Manage all users</p>
      </div>

      <div className="flex items-center gap-2">
        <Link href="/usermanagement/view-roles">
          <Button className="bg-white border border-gray-200 py-3 text-black text-sm px-4 flex items-center justify-center gap-2 text-center rounded-xl">
            View roles
          </Button>
        </Link>
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="bg-primary-green flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl">
              <LuPlusCircle /> Add New
              <div className="border-r-[0.3px] border-opacity-50 border-white h-10"></div>
              <IoIosArrowDown />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="z-50 absolute right-0 mt-2 px-1 py-1 w-44 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
              <Menu.Item>
                <Link href="/usermanagement/new-user">
                  <button className="flex hover:text-primary-dark hover:bg-gray-50 w-full items-center rounded-md px-3 py-2">
                    New user
                  </button>
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link href="/usermanagement/new-role">
                  <button className="flex hover:text-primary-dark hover:bg-gray-50 w-full items-center rounded-md px-3 py-2">
                    New role
                  </button>
                </Link>
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
}

export default Nav;
