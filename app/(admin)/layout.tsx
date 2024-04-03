"use client";

// Next & React imports
import React, { useEffect, useState } from "react";

import { usePathname, useRouter } from "next/navigation";

// components
import SideNav from "@/components/SideNav/SideNav";
import TopNav from "@/components/TopNav/TopNav";
import BuilderNav from "./forms/builder/FormTopNav";

// hooks
import useAdmin from "@/hooks/useAdmin";

//
import { FormProvider } from "../../contexts/FormContext";

// icons
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { RxCountdownTimer } from "react-icons/rx";
import { PiBuildingsBold } from "react-icons/pi";
import { BiTargetLock } from "react-icons/bi";
import UserIcon from "@/public/icons/UserIcon";

// toast
import toast from "react-hot-toast";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { admin, removeAdmin } = useAdmin();

  const [loading, setLoading] = useState(true);

  // Redirect to login if not authenticated

  useEffect(() => {
    if (admin === null || !Boolean(admin?.access_token)) {
      router.push("/login");
    } else {
      let role = admin?.profiles[0]?.role_id;

      // CHECK ROLES AND ROUTE TO RIGHT DESTINATIONS
      // LOGICIEL ADMIN ROLE ID: 1
      if (role == 1) {
        setLoading(false);
        router.push("/");
        return;
      }
      // COMPANY ADMIN ROLE ID: 6
      if (role == 6) {
        setLoading(false);
        router.push("/company");
        return;
      } else {
        removeAdmin();
        router.push("/login");
        toast.error("Access not granted. Check with your administrator");
      }

      setLoading(true);
    }
  }, [admin]);

  // ADMIN NAVIGATION
  const navigation = [
    {
      name: "Dashboard",
      icon: <UserIcon />,
      link: "/",
    },
    {
      name: "Forms",
      icon: <RxCountdownTimer size={20} />,
      link: "/forms",
    },
    {
      name: "User management",
      icon: <UserIcon />,
      link: "/usermanagement",
    },
    {
      name: "Company setup",
      icon: <PiBuildingsBold size={20} />,
      link: "/company-setup",
    },
    {
      name: "Jurisdiction setup",
      icon: <BiTargetLock size={20} />,
      link: "/jurisdiction-setup",
    },
  ];

  return (
    <div>
      <FormProvider>
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
                  {!pathname.includes("settings") && (
                    <SideNav navigation={navigation} />
                  )}

                  <div className=" w-full mt-4 py-2">{children}</div>
                </div>
              </div>
            )}
          </>
        )}
      </FormProvider>
    </div>
  );
}
