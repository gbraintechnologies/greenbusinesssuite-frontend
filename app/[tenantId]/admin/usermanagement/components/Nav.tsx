"use client";

// icons
import { GoPlusCircle } from "react-icons/go";
import { IoIosArrowDown } from "react-icons/io";
import Link from "next/link";

import CompanyThemedButton from "@/components/Buttons/CompanyThemedButton";

function Nav() {
  return (
    <div className="w-full text-[#0F172A] px-5  flex justify-between">
      <div>
        <h3 className="font-semibold text-xl">User Management</h3>
        <p className="text-[rgba(71, 85, 105, 1)] font-normal text-base">
          Manage All Users
        </p>
      </div>

      <Link href={`usermanagement/create`}>
        <CompanyThemedButton className="flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl">
          <GoPlusCircle /> Add New{" "}
          {/* <div className="border-r-[0.3px] border-opacity-50 border-white h-10"></div>{" "}
          <IoIosArrowDown /> */}
        </CompanyThemedButton>
      </Link>
    </div>
  );
}

export default Nav;
