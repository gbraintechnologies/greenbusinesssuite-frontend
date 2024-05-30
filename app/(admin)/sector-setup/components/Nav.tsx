import Link from "next/link";
import { LuPlusCircle } from "react-icons/lu";

function Nav() {


  return (
    <div className="w-full text-[#0F172A] px-5 flex justify-between">
      <div>
        <h3 className="font-semibold text-xl">Sector Setup</h3>
      </div>

      <div>
        <Link href="/sector-setup/add-sector" className="bg-primary-green flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl">
          <LuPlusCircle /> Add New Sector
          <div className="border-opacity-50 border-white h-10"></div>
        </Link>
      </div>
    </div>
  );
}

export default Nav;