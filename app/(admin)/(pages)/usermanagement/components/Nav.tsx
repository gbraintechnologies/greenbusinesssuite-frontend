"use client";

import Link from "next/link";
import { Button } from "@heroui/react";

function Nav() {
  return (
    <div className="mb-4 flex w-full flex-col gap-3 text-[#0F172A] sm:flex-row sm:items-center sm:justify-between">
      <h3 className="shrink-0 text-xl font-semibold sm:text-2xl">
        User Management
      </h3>

      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
        <Button
          as={Link}
          color="primary"
          href="/usermanagement/new-user"
          className="w-full text-white sm:w-auto"
        >
          New User
        </Button>
        <Button
          as={Link}
          href="/usermanagement/view-roles"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-center text-sm text-black sm:w-auto"
        >
          View all roles
        </Button>
      </div>
    </div>
  );
}

export default Nav;
