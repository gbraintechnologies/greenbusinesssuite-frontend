"use client";

// Next & React imports
import React, { useEffect, useState } from "react";

import { usePathname, useRouter } from "next/navigation";

// components
import SideNav from "./components/SideNav";
import TopNav from "./components/TopNav";

// hooks
import useAdmin from "@/hooks/useAdmin";

// icons
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { admin } = useAdmin();

  const [loading, setLoading] = useState(true);

  // Redirect to login if not authenticated

  useEffect(() => {
    if (admin === null || admin?.access_token?.length < 10) {
      router.push("/");
    } else {
      setLoading(false);
    }
  }, [admin]);

  return (
    <div>
      {loading ? (
        <div className="w-full h-screen flex items-center justify-center">
          <AiOutlineLoading3Quarters size={24} className="animate-spin" />
        </div>
      ) : (
        <div className="w-full min-h-[100vh]">
          <TopNav />
          <div className="flex flex-row">
            {!pathname.includes("settings") && <SideNav />}

            <div className="mt-4 p-2">{children}</div>
          </div>
        </div>
      )}
    </div>
  );
}
