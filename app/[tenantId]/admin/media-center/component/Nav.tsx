"use client";

import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { GoPlusCircle } from "react-icons/go";
import { IoIosArrowDown } from "react-icons/io";
import Link from "next/link";
import CompanyThemedButton from "@/components/Buttons/CompanyThemedButton";

interface NavProps {
  tenantId: string;
}

function Nav({ tenantId }: NavProps) {
  return (
    <div className="w-full text-[#0F172A] flex justify-between">
      <div>
        <h3 className="font-semibold text-xl">Media Center</h3>
      </div>

      <div className="flex items-center gap-2">
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button as={Fragment}>
              <CompanyThemedButton className="flex items-center gap-2">
                <GoPlusCircle /> Add New
                <div className="border-r-[0.3px] border-opacity-50 border-white h-10"></div>
                <IoIosArrowDown />
              </CompanyThemedButton>
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
                <Link
                  href={{
                    pathname: `/${tenantId}/admin/media-center/upload-blog`,
                    query: { type: "BLOGS" },
                  }}
                >
                  <button className="flex hover:text-primary-dark hover:bg-gray-50 w-full items-center rounded-md px-3 py-2">
                    Blog
                  </button>
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link
                  href={{
                    pathname: `/${tenantId}/admin/media-center/upload-video`,
                    query: { type: "VIDEOS" },
                  }}
                >
                  <button className="flex hover:text-primary-dark hover:bg-gray-50 w-full items-center rounded-md px-3 py-2">
                    Video
                  </button>
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link
                  href={{
                    pathname: `/${tenantId}/admin/media-center/upload-ads`,
                    query: { type: "ADS" },
                  }}
                >
                  <button className="flex hover:text-primary-dark hover:bg-gray-50 w-full items-center rounded-md px-3 py-2">
                    Ad
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
