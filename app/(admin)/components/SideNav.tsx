import Link from "next/link";
import React from "react";

// icons
import { HiOutlineUser } from "react-icons/hi2";

import { usePathname } from "next/navigation";

function SideNav() {
  const navigation = [
    {
      name: "Dashboard",
      icon: <HiOutlineUser size={20} />,
      link: "/dashboard",
    },
    {
      name: "Forms",
      icon: <HiOutlineUser size={20} />,
      link: "/forms",
    },
    {
      name: "User management",
      icon: <HiOutlineUser size={20} />,
      link: "/usermanagement",
    },
    {
      name: "Company setup",
      icon: <HiOutlineUser size={20} />,
      link: "/company-setup",
    },
    {
      name: "Jurisdiction setup",
      icon: <HiOutlineUser size={20} />,
      link: "/jurisdiction-setup",
    },
  ];
  const pathname = usePathname();

  return (
    <aside className="w-[20rem] sticky top-[6vh] border-gray-300 border-r bg-[#E2E8F0] px-5 p-2 h-[94vh]">
   {/* <input
        className="w-full shadow-sm border outline-none focus:outline-none font-light border-gray-200 p-2 mt-4 rounded-lg mb-5"
        placeholder="Search"
      /> */}
      <ul>
        {navigation.map((item) => {
          return (
            <Link key={item.name} href={item.link}>
              <li
                className={`${
                  pathname.includes(item.link)
                    ? "bg-gray-300 text-[#1E293B] font-semibold"
                    : "text-gray-600 "
                } flex items-center gap-3 w-full mb-1 py-2 px-3 rounded-xl font-medium `}
              >
                {item.icon} <p>{item.name}</p>
              </li>
            </Link>
          );
        })}
      </ul>
    </aside>
  );
}

export default SideNav;
