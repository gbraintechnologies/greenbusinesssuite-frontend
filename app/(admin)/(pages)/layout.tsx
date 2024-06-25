"use client";

// Next & React imports
import React, { useEffect, useState } from "react";

import { redirect, usePathname, useRouter } from "next/navigation";

// components
import SideNav from "@/components/SideNav/SideNav";
import TopNav from "@/components/TopNav/TopNav";
import BuilderNav from "./forms/builder/FormTopNav";

// hooks
import useAdmin from "@/hooks/useAdmin";

//
import { FormProvider } from "../../../contexts/FormContext";

// icons
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { PiBuildingsBold } from "react-icons/pi";
import { BiTargetLock } from "react-icons/bi";
import UserIcon from "@/public/icons/UserIcon";
import { AiOutlineMoneyCollect } from "react-icons/ai";
import { RiFlag2Fill } from "react-icons/ri";
import { FaLandMineOn } from "react-icons/fa6";
import { PiListMagnifyingGlassBold } from "react-icons/pi";

//
import useAuth from "@/hooks/useAuth";
import FormsNavIcon from "@/public/icons/FormsNavIcon";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { admin, removeAdmin } = useAdmin();
  const { auth, removeAuth } = useAuth();

  const [loading, setLoading] = useState(true);

  // Redirect to login if not authenticated1
  useEffect(() => {
    if (admin === null || !Boolean(auth?.access_token)) {
      router.push("/auth");
    } else {
      let role = admin?.profiles[0]?.role_id;

      // CHECK ROLES AND ROUTE TO RIGHT DESTINATIONS
      // LOGICIEL ADMIN ROLE ID: 1
      if (role == 1) {
        setLoading(false);
        return;
      }
      // COMPANY ADMIN ROLE ID: 6
      if (role == 6) {
        setLoading(false);
        if (pathname.includes("/settings")) {
          return;
        }
        setLoading(true);
        redirect("/company");
      }

      setLoading(true);

      // else
      removeAdmin();
      removeAuth();
      //
      router.push("/login");
    }
  }, [admin, pathname]);

  // ADMIN NAVIGATION
  const navigation = [
    {
      name: "Dashboard",
      icon: <UserIcon />,
      link: "/",
    },
    {
      name: "Forms",
      icon: <FormsNavIcon />,
      link: "/forms",
    },
    {
      name: "Companies",
      icon: <PiBuildingsBold size={20} />,
      link: [
        "/company-setup",
        "/company-setup/create",
        "/company-setup/profile",
        "/company-setup/profile/edit",
      ],
    },
    {
      name: "Jurisdiction setup",
      icon: <BiTargetLock size={20} />,
      link: null,
      subNavigation: [
        {
          name: "Country setup",
          icon: null, //<RiFlag2Fill size={20} />,
          link: "/country-setup",
        },
        {
          name: "Currency setup",
          icon: null, //<AiOutlineMoneyCollect size={20} />,
          link: "/currency-setup",
        },
        {
          name: "Sector setup",
          icon: null, //<FaLandMineOn size={20} />,
          link: "/sector-setup",
        },
      ],
    },
    {
      name: "User management",
      icon: <UserIcon />,
      link: "/usermanagement",
    },
    {
      name: "Audit trail",
      icon: <PiListMagnifyingGlassBold size={18} />,
      link: ["/audit-trail", "/audit-trail/profile"],
    },
  ];

  const thirdPartyApps = [
    {
      name: "Business Analysis Tool",
      icon: <UserIcon />,
      link: "/business-analysis",
    },
  ];

  return (
    <div>
      {pathname.includes("auth") ? (
        <>{children}</>
      ) : (
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
                      <SideNav
                        thirdPartyApps={thirdPartyApps}
                        navigation={navigation}
                      />
                    )}

                    <div className=" w-full mt-4 py-2">{children}</div>
                  </div>
                </div>
              )}
            </>
          )}
        </FormProvider>
      )}
    </div>
  );
}
