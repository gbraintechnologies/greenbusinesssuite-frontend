import Link from "next/link";
import React from "react";

// icons
import { HiOutlineUser } from "react-icons/hi2";
import { RxCountdownTimer } from "react-icons/rx";
import { PiBuildingsBold } from "react-icons/pi";
import { BiTargetLock } from "react-icons/bi";

import { usePathname } from "next/navigation";
import UserIcon from "@/public/icons/UserIcon";

function SideNav() {
  const navigation = [
    {
      name: "Dashboard",
      icon: <UserIcon />,
      link: "/",
    },
    {
      name: "Forms",
      icon: <RxCountdownTimer size={20} />,
      link: "/forms",
    },
    {
      name: "User management",
      icon: <UserIcon />,
      link: "/usermanagement",
    },
    {
      name: "Company setup",
      icon: <PiBuildingsBold size={20} />,
      link: "/company-setup",
    },
    {
      name: "Jurisdiction setup",
      icon: <BiTargetLock size={20} />,
      link: "/jurisdiction-setup",
    },
  ];
  const pathname = usePathname();

  return (
    <aside className="w-[22rem] sticky top-[7vh] border-[#E2E8F0] border-r bg-[#F8FAFC] px-5 p-2 h-[93vh]">
      <ul className="mt-4">
        {navigation.map((item) => {
          return (
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
          );
        })}
      </ul>
    </aside>
  );
}

export default SideNav;
