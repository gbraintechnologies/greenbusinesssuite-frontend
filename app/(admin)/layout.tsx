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
import BuilderNav from "./forms/builder/components/BuilderNav";

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
      router.push("/login");
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
        // TWO LAYOUTS: NORMAL VIEW AND BUILDER VIEW
        <>
          {/* BUILDER VIEW */}
          {pathname.includes("/forms/builder") ? (
            <div className="w-full min-h-[100vh] bg-grid">
              <BuilderNav />

              {children}
            </div>
          ) : (
            // NORMAL VIEW
            <div className="w-full min-h-[100vh]">
              <TopNav />
              <div className="flex flex-row">
                {!pathname.includes("settings") && <SideNav />}

                <div className=" w-full mt-4 py-2">{children}</div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
