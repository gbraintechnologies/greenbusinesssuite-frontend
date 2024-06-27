"use client";

// Next & React imports
import React, { useEffect, useState, Suspense } from "react";

import { usePathname, useRouter } from "next/navigation";

// components
import SideNav from "@/components/SideNav/SideNav";
import TopNav from "@/components/TopNav/TopNav";

// icons
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdOutlineDashboard } from "react-icons/md";
import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { FaUsers } from "react-icons/fa";
import { PiListMagnifyingGlassBold } from "react-icons/pi";

// toast
import toast from "react-hot-toast";

// hooks
import useAuth from "@/hooks/useAuth";
import FormsNavIcon from "@/public/icons/FormsNavIcon";
import useCompany from "@/hooks/useCompany";

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { companyAdmin } = useCompany();

  const { auth } = useAuth();

  const [loading, setLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    console.log("checks", !Boolean(auth) || !Boolean(companyAdmin));
    setLoading(true);
    if (!Boolean(auth) || !Boolean(companyAdmin)) {
      router.push("/company/auth");
    } else {
      // CHECK COMPANY ADMIN ROLE: 6
      let role = companyAdmin?.profiles[0]?.role_id;

      // COMPANY ADMIN ROLE ID: 6
      if (role !== 6) {
        router.push("/company/auth");
        toast.dismiss();
        toast.error("Access not granted. Check with your administrator");
      }

      // Only allow view if role is 6
      if (role === 6) {
        setLoading(false);
      }
    }
  }, [companyAdmin, auth, pathname]);

  // COMPANY ADMIN NAVIGATION
  const navigation = [
    {
      name: "Dashboard",
      icon: <MdOutlineDashboard size={20} />,
      link: "/company",
    },
    {
      name: "Forms",
      icon: <FormsNavIcon />,
      link: "/company/forms",
    },

    {
      name: "Reports",
      icon: <TbBrandGoogleAnalytics size={20} />,
      link: null,
      subNavigation: [
        {
          name: "Form Reports",
          icon: null,
          link: "/company/form-reports",
        },
      ],
    },

    {
      name: "User management",
      icon: <FaUsers size={20} />,
      link: "/company/usermanagement",
    },

    {
      name: "Audit Trail",
      icon: <PiListMagnifyingGlassBold size={18} />,
      link: "/company/audit-trail",
    },
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

        <div className="w-full min-h-[100vh]">
          <TopNav />
          <div className="flex flex-row">
            {!pathname.includes("settings") && (
              <SideNav
                thirdPartyApps={thirdPartyApps}
                navigation={navigation}
              />
            )}

            <div className="w-full">{children}</div>
          </div>
        </div>
      )}
    </Suspense>
  );
}
