"use client";

import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";

// icons
import { LuPlusCircle } from "react-icons/lu";
import { IoIosArrowDown } from "react-icons/io";
import Link from "next/link";

function Nav() {
  return (
    <div className="w-full text-[#0F172A] px-5  flex justify-between">
      <div>
        <h3 className="font-semibold text-xl">Companies</h3>
        <p className="text-[rgba(71, 85, 105, 1)] font-normal text-base">Form Description</p>
      </div>

      <Link href={"/company-setup/create"}>
        <button className="bg-primary-green flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl">
          <LuPlusCircle /> Add New{" "}
          <div className="border-r-[0.3px] border-opacity-50 border-white h-10"></div>{" "}
          <IoIosArrowDown />
        </button>
      </Link>
    </div>
  );
}

export default Nav;
