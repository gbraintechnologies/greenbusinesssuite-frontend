"use client";

import Link from "next/link";
import React from "react";

import { usePathname } from "next/navigation";
import { Disclosure } from "@headlessui/react";

// icons
import { FiChevronDown } from "react-icons/fi";

function SideNav({ navigation, type = "normal", thirdPartyApps = [] }: any) {
  const pathname = usePathname();

  return (
    <aside className="w-[20rem] overflow-y-scroll no-scrollbar fixed   border-[#E2E8F0] border-r bg-[#F8FAFC] px-5 p-2 h-screen pb-32">
      {/* IN BUILT APPS / FEATURES / COMPANY APPS */}
      <ul className="mt-4">
        {type === "normal" && (
          <li className="text-xs font-light text-gray-500 mb-2">
            ORGANIZATION
          </li>
        )}
        {navigation.map((item: any, index: number) => {
          // SUBNAVIGATION
          if (item.subNavigation) {
            return (
              <React.Fragment key={index}>
                <Disclosure defaultOpen >
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex mt-2 w-full justify-between items-center">
                        <div key={item.name}>
                          <li
                            className={`${
                              pathname.includes(item.link)
                                ? "bg-[#E2E8F0] text-[#1E293B] font-semibold"
                                : "text-gray-600 "
                            } flex items-center gap-3 w-full mb-1 py-2 px-3 rounded-xl font-medium `}
                          >
                            {item.icon} <p>{item.name}</p>
                          </li>
                        </div>
                        <FiChevronDown
                          size={17}
                          className={`${
                            open ? "rotate-180 transform" : ""
                          } -mt-1`}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel>
                        <div className="pl-5">
                          {item.subNavigation.map((sub: any, index: number) => {
                            let link = sub.link;
                            if (Array.isArray(sub.link)) {
                              link = sub.link[0];
                            }
                            return (
                              <Link key={index} href={link}>
                                <li
                                  className={`${
                                    pathname.includes(link)
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
              </React.Fragment>
            );
          } else {
            // STANDARD NAVIGATION
            return (
              <Link
                key={index}
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
      {type === "normal" && (
        <ul className="mt-8">
          <li className="text-xs font-light text-gray-500 mb-2">
            THIRD PARTY APPS
          </li>
          {thirdPartyApps.map((item: any, index: number) => {
            return (
              <Link
                key={index}
                className="cursor-pointer"
                href={Array.isArray(item.link) ? item.link[0] : item.link}
              >
                <button
                  disabled
                  className={`${
                    (Array.isArray(item.link) &&
                      item.link.includes(pathname)) ||
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
      )}
    </aside>
  );
}

export default SideNav;
