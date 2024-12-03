import Link from "next/link";
import { IoIosAddCircleOutline } from "react-icons/io";
import { RiSettingsLine } from "react-icons/ri";

function Nav() {

  return (
    <div className="w-full text-[#0F172A] px-5 flex justify-between">
      <div>
        <h3 className="font-semibold text-xl">Category Setup</h3>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/category-setup/add-category" className="bg-primary-green flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl">
          <IoIosAddCircleOutline /> Create new Category
          <div className="border-opacity-50 border-white h-10"></div>
        </Link>
        <div>
          <Link
            href="/category-setup/core-modules"
            className="bg-white border border-gray-200 flex text-black text-sm px-4 hover:bg-gray-100 hover:opacity-95 items-center gap-2 rounded-xl"
          >
            <RiSettingsLine /> Core Modules
            <div className="border-opacity-50 border-white h-10"></div>
          </Link>

        </div>
      </div>
    </div>
  );
}

export default Nav;