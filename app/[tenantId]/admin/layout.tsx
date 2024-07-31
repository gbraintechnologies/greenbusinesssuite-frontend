"use client";

// Next & React imports
import React, { useEffect, useState, Suspense } from "react";

import { usePathname, useRouter } from "next/navigation";

// components
import SideNav from "@/components/SideNav/SideNav";
import TopNav from "@/components/TopNav/CompanyTopNav";

// icons
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdOutlineDashboard } from "react-icons/md";
import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { FaUsers } from "react-icons/fa";
import { MdOutlineSupervisedUserCircle } from "react-icons/md";
import { PiListMagnifyingGlassBold } from "react-icons/pi";

// toast
import { toast } from "sonner";

// hooks
import useAuth from "@/hooks/useAuth";
import FormsNavIcon from "@/public/icons/FormsNavIcon";
import useCompany from "@/hooks/useCompany";

export default function CompanyLayout({ children, params }: any) {
  // {

  //  children: React.ReactNode;
  // }

  const pathname = usePathname();
  const router = useRouter();

  const { companyAdmin } = useCompany();

  const { auth } = useAuth();

  const [loading, setLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    setLoading(true);
    if (!Boolean(auth) || !Boolean(companyAdmin)) {
      router.push(`${params?.tenantId}/auth`);
    } else {
      // CHECK COMPANY ADMIN ROLE: 6
      let role = companyAdmin?.profiles[0]?.role_id;
      setLoading(false);
    }
  }, [companyAdmin, auth, pathname]);

  // COMPANY ADMIN NAVIGATION
  const navigation = [
    {
      name: "Dashboard",
      icon: <MdOutlineDashboard size={20} />,
      link: "/company/admin",
    },
    {
      name: "Forms",
      icon: <FormsNavIcon />,
      link: "/company/admin/forms",
    },
    {
      name: "Customers",
      icon: <MdOutlineSupervisedUserCircle size={20} />,
      link: "/company/admin/customers",
    },

    {
      name: "Reports",
      icon: <TbBrandGoogleAnalytics size={20} />,
      link: null,
      subNavigation: [
        {
          name: "Form Reports",
          icon: null,
          link: "/company/admin/form-reports",
        },
      ],
    },

    {
      name: "User management",
      icon: <FaUsers size={20} />,
      link: "/company/admin/usermanagement",
    },

    // {
    //   name: "Audit Trail",
    //   icon: <PiListMagnifyingGlassBold size={18} />,
    //   link: "/company/audit-trail",
    // },
  ];

  const thirdPartyApps: any = [];

  return (
    <Suspense>
      {loading ? (
        <div className="w-full h-screen flex items-center justify-center">
          <AiOutlineLoading3Quarters size={24} className="animate-spin" />
        </div>
      ) : (
        // TWO LAYOUTS: NORMAL VIEW AND BUILDER VIEW

        <div className="w-full min-h-screen">
          <TopNav />
          <div className="flex mt-[3.5rem]   flex-row h-screen">
            <div className="hidden  md:flex h-full absolute  overflow-y-scroll no-scrollbar">
              {!pathname.includes("settings") && (
                <SideNav
                  thirdPartyApps={thirdPartyApps}
                  navigation={navigation}
                />
              )}{" "}
            </div>

            <div
              className={`${
                pathname.includes("settings") ? "ml-0" : "ml-[20rem]"
              } w-full`}
            >
              {children}
            </div>
          </div>
        </div>
      )}
    </Suspense>
  );
}
