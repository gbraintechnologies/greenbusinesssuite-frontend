import Link from "next/link";
import React from "react";

// icons
import { HiOutlineUser } from "react-icons/hi2";
import { RxCountdownTimer } from "react-icons/rx";
import { GoShieldLock } from "react-icons/go";

import { usePathname } from "next/navigation";

function SettingsSideNav() {
  const navigation = [
    {
      name: "Account",
      icon: <HiOutlineUser size={20} />,
      link: "/settings",
    },
    {
      name: "Security",
      icon: <GoShieldLock size={20} />,
      link: "/settings/security",
    },
  ];
  const pathname = usePathname();

  return (
    <aside className="w-[20rem] sticky  px-5 p-2 h-[80vh]">
      <div className="flex gap-3 items-center mb-5">
        <div className="flex items-center rounded-full justify-center w-14 h-14 bg-gray-100">
          AK
        </div>
        <div>
          <h4 className="font-bold text-lg">Akwesi Konadu</h4>
          <p className="text-sm font-light">Your personal account</p>
        </div>
      </div>
      <ul>
        {navigation.map((item) => {
          return (
            <Link key={item.name} href={item.link}>
              <li
                className={`${
                  pathname === item.link
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

export default SettingsSideNav;
