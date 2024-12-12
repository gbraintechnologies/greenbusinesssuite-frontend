"use client";

// icons
import { GoPlusCircle } from "react-icons/go";
import Link from "next/link";
import useAdmin from "@/hooks/useAdmin";
import { PermissionTypes } from "@/types/permissionTypes";

function Nav() {
  const { checkPermission } = useAdmin();

  return (
    <div className="w-full text-[#0F172A] px-5  flex justify-between">
      <div>
        <h3 className="font-semibold text-xl">Companies</h3>
        <p className="text-[rgba(71, 85, 105, 1)] font-normal text-base">
          All companies onboarded
        </p>
      </div>

      {checkPermission(PermissionTypes.CREATE_COMPANY) && (
        <Link href={"/company-setup/create"}>
          <button className="bg-primary-green flex text-white text-sm px-4 py-3 hover:opacity-95 items-center gap-2 rounded-xl">
            <GoPlusCircle size={15} /> Add New{" "}
          </button>
        </Link>
      )}
    </div>
  );
}

export default Nav;
