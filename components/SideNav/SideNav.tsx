import Link from "next/link";
import React from "react";

import { usePathname } from "next/navigation";

function SideNav({ navigation }: any) {
  const pathname = usePathname();

  return (
    <aside className="w-[22rem] sticky top-[7vh] border-[#E2E8F0] border-r bg-[#F8FAFC] px-5 p-2 h-[93vh]">
      <ul className="mt-4">
        {navigation.map((item: any) => {
          if (item.subNavigation) {
            return (
              <>
                <Link key={item.name} href={item.link}>
                  <li
                    className={`${
                      pathname == item.link
                        ? "bg-[#E2E8F0] text-[#1E293B] font-semibold"
                        : "text-gray-600 "
                    } flex items-center gap-3 w-full mb-1 py-2 px-3 rounded-xl font-medium `}
                  >
                    {item.icon} <p>{item.name}</p>
                  </li>
                </Link>

                <div className="pl-5">
                  {item.subNavigation.map((sub: any) => {
                    return (
                      <Link key={sub.name} href={sub.link}>
                        <li
                          className={`${
                            pathname == sub.link
                              ? "bg-[#E2E8F0] text-[#1E293B] font-semibold"
                              : "text-gray-600 "
                          } flex items-center gap-3 w-full mb-1 py-2 px-3 rounded-xl font-medium `}
                        >
                          {sub.icon} <p>{sub.name}</p>
                        </li>
                      </Link>
                    );
                  })}
                </div>
              </>
            );
          } else {
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
                  } flex items-center gap-3 w-full mb-1 py-2 px-3 rounded-xl font-medium `}
                >
                  {item.icon} <p>{item.name}</p>
                </li>
              </Link>
            );
          }
        })}
      </ul>
    </aside>
  );
}

export default SideNav;
