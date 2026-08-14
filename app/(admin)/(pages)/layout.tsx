"use client";

// Next & React imports
import React, { useEffect } from "react";

import { usePathname, useRouter } from "next/navigation";

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
import { TbBrandGoogleAnalytics } from "react-icons/tb";
import FormsNavIcon from "@/public/icons/FormsNavIcon";
import SessionExpiredModal from "@/components/GlobalModal/GlobalModal";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { admin, hasHydrated: adminHydrated } = useAdmin();
  const { auth, hasHydrated: authHydrated } = useAuth();

  const sessionReady = Boolean(adminHydrated && authHydrated);
  const accessToken = auth?.accessToken ?? auth?.access_token;
  const isAuthenticated = Boolean(admin) && Boolean(accessToken);

  // Wait for localStorage hydration, then redirect if unauthenticated.
  // Auth is client-only (no middleware), so we must not paint the dashboard
  // shell until we know whether a session exists.
  useEffect(() => {
    if (!sessionReady) return;
    if (!isAuthenticated) {
      router.replace("/auth");
    }
  }, [sessionReady, isAuthenticated, router]);

  const loading = !sessionReady || !isAuthenticated;

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
        {
          name: "Branding",
          icon: null,
          link: ["/branding", "/branding/create"],
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
    {
      name: "Analytics",
      icon: <TbBrandGoogleAnalytics size={20} />,
      link: null,
      subNavigation: [
        {
          name: "General Business",
          icon: null,
          link: "/analytics/general-business",
        },
        {
          name: "Loans & Grants",
          icon: null,
          link: "/analytics/loans-grants",
        },
        {
          name: "Training",
          icon: null,
          link: "/analytics/training",
        },
        {
          name: "Clients",
          icon: null,
          link: "/analytics/clients",
        },
      ],
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
