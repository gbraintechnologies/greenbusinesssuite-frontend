import Link from "next/link";
import React from "react";

function TopNav() {
  return (
    <nav className="h-[7vh] bg-[#1E293B] w-full flex justify-between items-center px-5">
      <div className="w-10 h-[60%] flex items-center justify-center rounded-lg bg-[#E2E8F0]">
        <Link href="/dashboard">M</Link>
      </div>

      <Link href="/settings">
        <button className="w-8 h-8 text-sm rounded-full flex items-center justify-center bg-[#E2E8F0]">
          AK
        </button>
      </Link>
    </nav>
  );
}

export default TopNav;
