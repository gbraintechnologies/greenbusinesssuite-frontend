"use client";

// Next & React imports
import React, { useEffect, useState } from "react";

import { redirect, usePathname, useRouter } from "next/navigation";

// components
import SideNav from "@/components/SideNav/SideNav";
import TopNav from "@/components/TopNav/AdminTopNav";
import { MobileNavProvider } from "@/contexts/MobileNavContext";
import BuilderNav from "./forms/builder/FormTopNav";

// hooks
import useAdmin from "@/hooks/useAdmin";
import useAuth from "@/hooks/useAuth";

//
import { FormProvider } from "../../../contexts/FormContext";

// icons
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  FiGrid,
  FiSend,
  FiUsers,
} from "react-icons/fi";
import { PiBuildingsBold } from "react-icons/pi";
import { BiTargetLock } from "react-icons/bi";
import FormsNavIcon from "@/public/icons/FormsNavIcon";
import SessionExpiredModal from "@/components/GlobalModal/GlobalModal";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { admin, removeAdmin } = useAdmin();
  const { auth, removeAuth } = useAuth();

  const [loading, setLoading] = useState(false);

  // Redirect to login if not authenticated1
  useEffect(() => {
    if (admin === null || !Boolean(auth?.accessToken)) {
      router.push("/auth");
    } else {
      // let role = admin?.profiles[0]?.role_id;
      // CHECK ROLES AND ROUTE TO RIGHT DESTINATIONS
      // LOGICIEL ADMIN ROLE ID: 1
      // TODO: Enable
      // if (role == 1) {
      //   setLoading(false);
      //   return;
      // }
      // // COMPANY ADMIN ROLE ID: 6
      // if (role == 6) {
      //   setLoading(false);
      //   if (pathname.includes("/settings")) {
      //     return;
      //   }
      //   setLoading(true);
      //   redirect("/company");
      // }
      // setLoading(true);
      // // else
      // removeAdmin();
      // removeAuth();
      // //
      // router.push("/login");
    }
  }, [admin, pathname]);

  // ADMIN NAVIGATION
  const navigation = [
    {
      name: "Dashboard",
      icon: <FiGrid size={18} />,
      link: "/",
    },
    {
      name: "Forms",
      icon: <FormsNavIcon />,
      link: "/forms",
    },
    {
      name: "Companies",
      icon: <PiBuildingsBold size={18} />,
      link: null,
      subNavigation: [
        {
          name: "All Companies",
          icon: null,
          link: [
            "/company-setup",
            "/company-setup/create",
            "/company-setup/configuration/create",
          ],
        },
        {
          name: "Category setup",
          icon: null,
          link: "/category-setup",
        },
      ],
    },
    {
      name: "Notifications Center",
      icon: <FiSend size={18} />,
      link: "/notifications-center",
    },
    {
      name: "Jurisdiction setup",
      icon: <BiTargetLock size={20} />,
      link: null,
      subNavigation: [
        {
          name: "Country setup",
          icon: null,
          link: "/country-setup",
        },
        {
          name: "Currency setup",
          icon: null,
          link: "/currency-setup",
        },
        {
          name: "Sector setup",
          icon: null,
          link: "/sector-setup",
        },
      ],
    },
    {
      name: "User management",
      icon: <FiUsers size={18} />,
      link: "/usermanagement",
    },
  ];

  let thirdPartyApps: any = [
    // {
    //   name: "Business Analysis Tool",
    //   icon: <UserIcon />,
    //   link: "/business-analysis",
    // },
  ];

  return (
    <div className="min-h-[90vh]">
      <SessionExpiredModal />
      {pathname.includes("auth") ? (
        <>{children}</>
      ) : (
        <FormProvider>
          {loading ? (
            <div className="w-full min-h-[90vh] flex items-center justify-center">
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
                <MobileNavProvider
                  hasSideNav={!pathname.includes("settings")}
                >
                  <div className="w-full min-h-[90vh] bg-surface-muted">
                    <TopNav />
                    <div className="mt-[3.5rem] flex min-h-[calc(100vh-3.5rem)] flex-row">
                      {!pathname.includes("settings") && (
                        <SideNav
                          thirdPartyApps={thirdPartyApps}
                          navigation={navigation}
                        />
                      )}

                      <div
                        className={`${
                          pathname.includes("settings")
                            ? "ml-0"
                            : "md:ml-[17.5rem]"
                        } w-full min-w-0 px-4 pt-4 sm:px-5`}
                      >
                        {children}
                      </div>
                    </div>
                  </div>
                </MobileNavProvider>
              )}
            </>
          )}
        </FormProvider>
      )}
    </div>
  );
}
