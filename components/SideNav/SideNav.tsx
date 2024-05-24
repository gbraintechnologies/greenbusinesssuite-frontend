"use client";

import Link from "next/link";
import React from "react";

import { usePathname } from "next/navigation";
import { Disclosure } from "@headlessui/react";

// icons
import { FiChevronDown } from "react-icons/fi";

function SideNav({ navigation, thirdPartyApps = [] }: any) {
  const pathname = usePathname();

  return (
    <aside className="w-[22rem] hidden md:block sticky top-[7vh] border-[#E2E8F0] border-r bg-[#F8FAFC] px-5 p-2 h-[93vh]">
      {/* IN BUILT APPS / FEATURES / COMPANY APPS */}
      <ul className="mt-4">
        <li className="text-xs font-light text-gray-500 mb-2">ORGANIZATION</li>
        {navigation.map((item: any) => {
          // SUBNAVIGATION
          if (item.subNavigation) {
            return (
              <>
                <Disclosure>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex mt-2 w-full justify-between items-center">
                        <p key={item.name}>
                          <li
                            className={`${
                              pathname == item.link
                                ? "bg-[#E2E8F0] text-[#1E293B] font-semibold"
                                : "text-gray-600 "
                            } flex items-center gap-3 w-full mb-1 py-2 px-3 rounded-xl font-medium `}
                          >
                            {item.icon} <p>{item.name}</p>
                          </li>
                        </p>
                        <FiChevronDown
                          size={17}
                          className={`${
                            open ? "rotate-180 transform" : ""
                          } -mt-1`}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel>
                        <div className="pl-5">
                          {item.subNavigation.map((sub: any) => {
                            return (
                              <Link key={sub.name} href={sub.link}>
                                <li
                                  className={`${
                                    pathname == sub.link
                                      ? "bg-[#E2E8F0] text-[#1E293B] font-semibold  "
                                      : "text-gray-600"
                                  } flex items-center w-full pl-5 gap-3 my-1 py-2 px-3 rounded-xl font-medium `}
                                >
                                  {sub.icon} <p>{sub.name}</p>
                                </li>
                              </Link>
                            );
                          })}
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              </>
            );
          } else {
            // STANDARD NAVIGATION
            return (
              <Link
                key={item.name}
                href={Array.isArray(item.link) ? item.link[0] : item.link}
              >
                <li
                  className={`${
                    (Array.isArray(item.link) &&
                      item.link.includes(pathname)) ||
                    (typeof item.link == "string" && item.link == pathname)
                      ? "bg-[#E2E8F0] text-[#1E293B] font-semibold"
                      : " text-gray-600"
                  } flex items-center gap-3 w-full my-2 mb-1 py-2 px-3 rounded-xl font-medium `}
                >
                  {item.icon} <p>{item.name}</p>
                </li>
              </Link>
            );
          }
        })}
      </ul>

      {/* THIRD PARTY APPS */}
      <ul className="mt-8">
        <li className="text-xs font-light text-gray-500 mb-2">
          THIRD PARTY APPS
        </li>
        {thirdPartyApps.map((item: any) => {
          return (
            <Link
              key={item.name}
              className="cursor-pointer"
              href={Array.isArray(item.link) ? item.link[0] : item.link}
            >
              <button
                disabled
                className={`${
                  (Array.isArray(item.link) && item.link.includes(pathname)) ||
                  (typeof item.link == "string" && item.link == pathname)
                    ? "bg-[#E2E8F0] text-[#1E293B] font-semibold"
                    : " text-gray-600"
                } flex items-center cursor-pointer disabled:cursor-not-allowed gap-3 w-full my-2 mb-1 py-2 px-3 rounded-xl font-medium `}
              >
                {item.icon} <p>{item.name}</p>
              </button>
            </Link>
          );
        })}
      </ul>
    </aside>
  );
}

export default SideNav;
