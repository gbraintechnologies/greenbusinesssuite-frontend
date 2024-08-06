import React from "react";

function NotFound() {
  return <div className="flex justify-center items-center h-screen">
    <div className="flex flex-col gap-3 w-80">
    <h1 className="text-[#94A3B8] font-bold text-9xl text-center">404</h1>
    <p className="text-slate-900 font-bold text-3xl text-center">Page not found</p>
    <p className="text-[#64748B] text-base text-center">It seems this page cannot be accessed due to broken links, deleted pages, etc.</p>
  </div>
  </div>;
}

export default NotFound;
