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
import useUser from "@/hooks/useUser";
import useAuth from "@/hooks/useAuth";

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { admin, removeAdmin } = useAdmin();

  const { auth, removeAuth } = useAuth();

  const [loading, setLoading] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (admin === null || !Boolean(auth)) {
      console.log("Please login to continue");
      router.push("/login");
    } else {
      // CHECK COMPANY ADMIN ROLE: 6
      let role = admin?.profiles[0]?.role_id;

      // COMPANY ADMIN ROLE ID: 6
      if (role !== 6) {
        router.push("/login");
        toast.error("Access not granted. Check with your administrator");
      }
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
      link: [
        "/company/apps",
        "/company/apps/mesh-forms",
        "/company/apps/mesh-forms/response",
      ],
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
