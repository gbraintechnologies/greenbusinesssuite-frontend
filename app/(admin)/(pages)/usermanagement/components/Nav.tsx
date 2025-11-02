"use client";

import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

// icons
import { GoPlusCircle } from "react-icons/go";
import { IoIosArrowDown } from "react-icons/io";
import Link from "next/link";
import { Button } from "@heroui/react";
import useAdmin from "@/hooks/useAdmin";
import { PermissionTypes } from "@/types/permissionTypes";

function Nav() {
  const { checkPermission } = useAdmin();

  return (
    <div className="w-full text-[#0F172A] px-5 flex justify-between mb-4">
      <div>
        <h3 className="font-semibold text-2xl">User Management</h3>
      </div>

      <div className="flex items-center gap-2">
        <Button
          as={Link}
          color="primary"
          href="/usermanagement/new-user"
          className="text-white"
        >
          New User
        </Button>
        <Button
          as={Link}
          href="/usermanagement/view-roles"
          className="bg-white border border-gray-200 py-3 text-black text-sm px-4 flex items-center justify-center gap-2 text-center rounded-xl"
        >
          View all roles
        </Button>
      </div>
    </div>
  );
}

export default Nav;
