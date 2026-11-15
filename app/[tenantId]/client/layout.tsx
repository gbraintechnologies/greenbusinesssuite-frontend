"use client";

// Next & React imports
import React, { useEffect, useState, Suspense } from "react";

import { usePathname } from "next/navigation";

// components
import SideNav from "@/components/SideNav/SideNav";
import TopNav from "@/components/TopNav/ClientTopNav";
import { MobileNavProvider } from "@/contexts/MobileNavContext";

// icons
import ClientDashboardIcon from "@/public/icons/ClientDashboardIcon";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  TbChartBar,
  TbCurrentLocation,
  TbDeviceLaptop,
  TbApps,
  TbSchool,
  TbCurrencyDollar,
} from "react-icons/tb";
import { HiOutlineDocumentText } from "react-icons/hi";

// hooks
import useUser from "@/hooks/useUser";
import { ClientFormProvider } from "@/contexts/ClientFormContext";
import useCompany from "@/hooks/useCompany";

// components
import Deactivated from "@/components/Deactivated/Deactivated";
import { AvailableModules } from "@/config/modules";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const { user } = useUser();

  const [loading] = useState(false);

  const { companyBranding: company, company: companyInfo } = useCompany();

  const [navigation, setNavigation] = useState([]);

  const tenant = company?.company_identifier;

  const all_navigation = [
    {
      name: "Dashboard",
      linkedModule: AvailableModules.Dashboard,
      icon: <ClientDashboardIcon />,
      link: `/${tenant}/client/dashboard`,
    },
    {
      name: "Services",
      linkedModule: AvailableModules.FormBuilder,
      icon: <TbDeviceLaptop size={20} />,
      link: `/${tenant}/client/services`,
    },
    {
      name: "Financial",
      linkedModule: AvailableModules.Dashboard,
      icon: <TbCurrencyDollar size={20} />,
      link: `/${tenant}/client/financial`,
    },
    {
      name: "Apps",
      linkedModule: AvailableModules.Dashboard,
      icon: <TbApps size={20} />,
      link: `/${tenant}/client/apps`,
    },
    {
      name: "Training",
      linkedModule: AvailableModules.MediaCenter,
      icon: <TbSchool size={20} />,
      link: `/${tenant}/client/training`,
      // Also show when Media Center is off — treated as core below
      alwaysShow: true,
    },
    {
      name: "Analytics",
      linkedModule: AvailableModules.Dashboard,
      icon: <TbChartBar size={20} />,
      link: `/${tenant}/client/analytics`,
    },
    {
      name: "Home",
      linkedModule: AvailableModules.MediaCenter,
      icon: <ClientDashboardIcon />,
      link: `/${tenant}/client/home`,
    },
    {
      name: "Documents",
      linkedModule: AvailableModules.FormBuilder,
      icon: <HiOutlineDocumentText />,
      link: `/${tenant}/client/documents`,
    },
  ];

  useEffect(() => {
    const enabled_modules = [...(company?.companyModules || [])];

    const temp: any = [];

    all_navigation.forEach((item: any) => {
      if (
        item.alwaysShow ||
        enabled_modules.includes(item.linkedModule) ||
        // Core customer areas stay visible even if modules list is thin
        ["Dashboard", "Services", "Financial", "Apps", "Analytics"].includes(
          item.name
        )
      ) {
        // Avoid duplicate Home if Media Center already covers it via Training-style always
        if (
          item.name === "Home" &&
          !enabled_modules.includes(AvailableModules.MediaCenter)
        ) {
          return;
        }
        temp.push(item);
      }
    });

    temp.push({
      name: "Settings",
      icon: <TbCurrentLocation size={20} />,
      link: `/${tenant}/client/settings`,
    });

    setNavigation(temp);
  }, [company, user, tenant]);

  if (companyInfo && companyInfo?.status?.toLowerCase() === "inactive") {
    return (
      <Deactivated
        title={`${company.name} Deactivated`}
        reason={`${company.name} has been deactivated.`}
      />
    );
  }

  return (
    <Suspense>
      <ClientFormProvider>
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
                  <MobileNavProvider
                    hasSideNav={
                      !pathname.includes("settings") &&
                      !pathname.includes("/client/form")
                    }
                  >
                    <TopNav />
                    <div className="mt-[3.5rem] flex min-h-[calc(100vh-3.5rem)] flex-row">
                      {!pathname.includes("settings") &&
                        pathname !== "/client/form" && (
                          <SideNav
                            type="client"
                            navigation={navigation}
                            homeHref={
                              tenant ? `/${tenant}/client/dashboard` : "/"
                            }
                            brandTitle={company?.name ?? "Green Business Suite"}
                            brandSubtitle="Client Portal"
                          />
                        )}

                      <div
                        className={`${
                          pathname.includes("settings") ||
                          pathname.includes("/client/form")
                            ? "ml-0"
                            : "md:ml-[17.5rem]"
                        } w-full min-w-0`}
                      >
                        {children}
                      </div>
                    </div>
                  </MobileNavProvider>
                </>
              )}
            </>
          ) : (
            <>{children}</>
          )}
        </div>
      </ClientFormProvider>
    </Suspense>
  );
}
