import Link from "next/link";
import { IoIosAddCircleOutline } from "react-icons/io";
import { RiSettingsLine } from "react-icons/ri";

function Nav() {
  return (
    <div className="w-full px-4 text-[#0F172A] sm:px-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-xl font-semibold sm:text-2xl">Category Setup</h3>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <Link
            href="/category-setup/add-category"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-green px-4 py-2.5 text-sm text-white hover:opacity-95 sm:w-auto"
          >
            <IoIosAddCircleOutline size={18} />
            Create new Category
          </Link>
          <Link
            href="/category-setup/core-modules"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-black hover:bg-gray-100 hover:opacity-95 sm:w-auto"
          >
            <RiSettingsLine size={16} />
            Core Modules
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Nav;
