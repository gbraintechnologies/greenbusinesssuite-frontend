"use client";

import { GoPlusCircle } from "react-icons/go";
import Link from "next/link";

function Nav() {
  return (
    <div className="flex w-full items-center justify-between px-5 text-primary-dark">
      <div>
        <h3 className="text-2xl font-semibold text-slate-900">Companies</h3>
        <p className="mt-0.5 text-sm text-slate-500">
          Manage organizations and tenants
        </p>
      </div>

      <Link href="/company-setup/create">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-brand-700"
        >
          <GoPlusCircle size={18} />
          Create New Company
        </button>
      </Link>
    </div>
  );
}

export default Nav;
