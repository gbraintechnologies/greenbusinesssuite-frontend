import Link from "next/link";
import { GoPlusCircle } from "react-icons/go";
import useAdmin from "@/hooks/useAdmin";
import { PermissionTypes } from "@/types/permissionTypes";

function Nav() {
  const { checkPermission } = useAdmin();

  return (
    <div className="w-full text-[#0F172A] px-5 flex justify-between">
      <div>
        <h3 className="font-semibold text-xl">Currency Setup</h3>
      </div>
      {checkPermission(PermissionTypes.CREATE_CURRENCY) && (
        <div>
          <Link
            href="/currency-setup/add-currency"
            className="bg-primary-green flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
          >
            <GoPlusCircle /> Add New Currency
            <div className="border-opacity-50 border-white h-10"></div>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Nav;
