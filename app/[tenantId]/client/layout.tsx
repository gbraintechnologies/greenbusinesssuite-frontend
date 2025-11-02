"use client";

// Next & React imports
import React, { useEffect, useState, Suspense } from "react";

import { usePathname, useRouter } from "next/navigation";

// components
import SideNav from "@/components/SideNav/SideNav";
import TopNav from "@/components/TopNav/ClientTopNav";

// icons
import ClientDashboardIcon from "@/public/icons/ClientDashboardIcon";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { TbCurrentLocation, TbDeviceLaptop } from "react-icons/tb";
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
  const router = useRouter();

  const { user } = useUser();

  const [loading, setLoading] = useState(false);

  const { companyBranding: company, company: companyInfo } = useCompany();

  useEffect(() => {
    // Redirect to login if not authenticated
    // if on a an authenticated page and isn't logged in
    // if (!Boolean(user) && !pathname.includes("auth")) {
    //   router.push(`/${company?.company_identifier}/auth`);
    //   toast.error("Please login to continue");
    // } else {
    //   setLoading(false);
    // }
  }, [user]);

  const [navigation, setNavigation] = useState([]);

  // COMPANY ADMIN NAVIGATION
  const all_navigation = [
    {
      name: "Home",
      linkedModule: AvailableModules.MediaCenter,
      icon: <ClientDashboardIcon />,
      link: `/${company?.company_identifier}/client/home`,
    },
    {
      name: "Services",
      linkedModule: AvailableModules.Dashboard,
      icon: <TbDeviceLaptop size={20} />,
      link: `/${company?.company_identifier}/client`,
    },
    {
      name: "Documents",
      linkedModule: AvailableModules.FormBuilder,
      icon: <HiOutlineDocumentText />,
      link: `/${company?.company_identifier}/client/documents`,
    },
  ];

  useEffect(() => {
    let enabled_modules = [
      ...company.companyModules,
      // ...company.modules,
      // ...company.categorySpecificModules,
    ];

    let temp: any = [];

    all_navigation.forEach((item) => {
      console.log("checking item", item);
      if (enabled_modules.includes(item.linkedModule)) {
        temp.push(item);
      }
    });

    // constants
    temp.push({
      name: "Settings",
      icon: <TbCurrentLocation size={20} />,
      link: `/${company?.company_identifier}/client/settings`,
    });

    // assign
    setNavigation(temp);
  }, [company, user]);

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
                  <TopNav />
                  <div className="flex flex-row h-[93.8vh] mt-[3.5rem]">
                    {!pathname.includes("settings") &&
                      pathname !== "/client/form" && (
                        <div className="hidden md:flex h-full  overflow-y-scroll no-scrollbar">
                          <SideNav type="client" navigation={navigation} />
                        </div>
                      )}

                    <div
                      className={`${
                        pathname.includes("settings") ||
                        pathname.includes("/client/form")
                          ? "ml-0"
                          : "ml-[20rem]"
                      } hidden md:block w-full`}
                    >
                      {children}
                    </div>
                    <div className="flex items-center p-20 text-center mx-auto justify-center h-[70vh] md:hidden">
                      <p>
                        Please visit this page on your laptop to access Mesh
                        Suite
                      </p>
                    </div>
                  </div>
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
