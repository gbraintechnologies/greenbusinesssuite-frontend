"use client";

// Next & React imports
import React, { useEffect, useState, Suspense } from "react";

import { redirect, usePathname, useRouter } from "next/navigation";

// components
import SideNav from "@/components/SideNav/SideNav";
import TopNav from "@/components/TopNav/TopNav";

// hooks
import useAdmin from "@/hooks/useAdmin";

// icons
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaBoxesStacked } from "react-icons/fa6";
import { MdOutlineDashboard } from "react-icons/md";
import { FaWpforms } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { IoMdPaper } from "react-icons/io";

// toast
import toast from "react-hot-toast";

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { admin, removeAdmin } = useAdmin();

  const [loading, setLoading] = useState(false);

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
        redirect("/");
      }
      // COMPANY ADMIN ROLE ID: 6
      if (role == 6) {
        setLoading(false);
        if((pathname.includes('company') || pathname.includes("/settings")) && (pathname !== "/company-setup")){
          return ;
        }
        redirect("/company");
      } 

        removeAdmin();
        router.push("/login");
        toast.error("Access not granted. Check with your administrator");
    }
  }, [admin, pathname]);

  // COMPANY ADMIN NAVIGATION
  const navigation = [
    {
      name: "Dashboard",
      icon: <MdOutlineDashboard size={20} />,
      link: "/company",
    },
    {
      name: "Apps",
      icon: <FaBoxesStacked size={20} />,
      link: "/company/apps",
    },
    {
      name: "Form Reports",
      icon: <FaWpforms size={20} />,
      link: ["/company/forms", "/company/forms/response"],
    },
    {
      name: "User management",
      icon: <FaUsers size={20} />,
      link: "/company/usermanagement",
    },

    {
      name: "Audit Trail",
      icon: <IoMdPaper size={20} />,
      link: "/company/audit-trail",
    },
  ];

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
              <SideNav navigation={navigation} />
            )}

            <div className=" w-full">{children}</div>
          </div>
        </div>
      )}
    </Suspense>
  );
}
