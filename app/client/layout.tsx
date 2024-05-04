"use client";

// Next & React imports
import React, { useEffect, useState, Suspense } from "react";

import { redirect, usePathname, useRouter } from "next/navigation";

// components
import SideNav from "@/components/SideNav/SideNav";
import TopNav from "@/components/TopNav/ClientTopNav";

// toast
import toast from "react-hot-toast";

// icons
import ClientDashboardIcon from "@/public/icons/ClientDashboardIcon";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { TbCurrentLocation } from "react-icons/tb";

// hooks
import useUser from "@/hooks/useUser";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { user } = useUser();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect to login if not authenticated
    // if on a an authenticated page and isn't logged in
    if (!Boolean(user) && !pathname.includes("auth")) {
      router.push("/client/auth");
      toast.error("Please login to continue");
    } else {
      setLoading(false);
    }
  }, [user]);

  // COMPANY ADMIN NAVIGATION
  const navigation = [
    {
      name: "Dashboard",
      icon: <ClientDashboardIcon />,
      link: "/client",
    },
    {
      name: "Settings",
      icon: <TbCurrentLocation size={20} />,
      link: "/client/settings",
    },
  ];

  console.log("pathname", pathname);

  return (
    <Suspense>
      <div className="w-full min-h-[100vh]">
        {!pathname.includes("auth") ? (
          <>
            {loading ? (
              <>
                <div className="w-full h-screen flex items-center justify-center">
                  <AiOutlineLoading3Quarters
                    size={24}
                    className="animate-spin"
                  />
                </div>
              </>
            ) : (
              <>
                {" "}
                <TopNav />
                <div className="flex flex-row">
                  {!pathname.includes("settings") &&
                    pathname !== "/client/form" && (
                      <div className="hidden md:block">
                        <SideNav navigation={navigation} />
                      </div>
                    )}

                  <div className="w-full">{children}</div>
                </div>
              </>
            )}
          </>
        ) : (
          <>{children}</>
        )}
      </div>
    </Suspense>
  );
}
