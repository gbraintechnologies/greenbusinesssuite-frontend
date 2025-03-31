"use client";

// Next & React imports
import React, { useEffect, useState, Suspense, use } from "react";

import { usePathname, useRouter } from "next/navigation";

// components
import SideNav from "@/components/SideNav/SideNav";
import TopNav from "@/components/TopNav/CompanyTopNav";

// icons
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdOutlineDashboard } from "react-icons/md";
import { TbBrandGoogleAnalytics, TbCreditCardRefund } from "react-icons/tb";
import { FaUsers } from "react-icons/fa";
import { MdOutlineSupervisedUserCircle } from "react-icons/md";
import { RiListSettingsFill } from "react-icons/ri";
import { PiListMagnifyingGlassBold } from "react-icons/pi";
import { GrMultimedia } from "react-icons/gr";

// hooks
import useAuth from "@/hooks/useAuth";
import FormsNavIcon from "@/public/icons/FormsNavIcon";
import useCompany from "@/hooks/useCompany";

// components
import Deactivated from "@/components/Deactivated/Deactivated";
import { LuSend } from "react-icons/lu";
import { AvailableModules } from "@/config/modules";

export default function CompanyLayout(props: any) {
  const params: any = use(props.params);

  const { children } = props;

  // {

  //  children: React.ReactNode;
  // }

  const pathname = usePathname();
  const router = useRouter();

  const {
    companyAdmin,
    companyBranding: company,
    company: companyInfo,
  } = useCompany();

  const { auth, removeAuth } = useAuth();

  const [loading, setLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    setLoading(true);
    if (!Boolean(auth) || !Boolean(companyAdmin)) {
      router.push(`/${params?.tenantId}/auth`);
    } else {
      // CHECK COMPANY ADMIN ROLE: 6
      let role = companyAdmin?.profiles[0]?.role_id;

      // clients with role 6 shouldn't access this dashboard
      if (role == 6) {
        removeAuth();
        router.push(`/${params?.tenantId}/auth`);
        return;
      }
      setLoading(false);
    }
  }, [companyAdmin, auth, pathname]);

  // COMPANY ADMIN NAVIGATION

  const [navigation, setNavigation] = useState([]);

  // Display modules based on what's available
  let all_navigation = [
    {
      name: "Dashboard",
      linkedModule: AvailableModules.Dashboard,
      icon: <MdOutlineDashboard size={20} />,
      link: `/${company?.company_identifier}/admin`,
    },
    {
      name: "Forms",
      linkedModule: AvailableModules.FormBuilder,
      icon: <FormsNavIcon />,
      link: `/${company?.company_identifier}/admin/forms`,
    },
    {
      name: "Customers",
      linkedModule: AvailableModules.FormBuilder,
      icon: <MdOutlineSupervisedUserCircle size={20} />,
      link: `/${company?.company_identifier}/admin/customers`,
    },
    {
      name: "Payments & Billing",
      linkedModule: AvailableModules.FormBuilder,
      icon: <TbCreditCardRefund size={20} />,
      link: null,
      subNavigation: [
        {
          name: "Billings",
          linkedModule: AvailableModules.FormBuilder,
          icon: null,
          link: `/${company?.company_identifier}/admin/billings`,
        },
        {
          name: "Payments",
          linkedModule: AvailableModules.FormBuilder,
          icon: null,
          link: `/${company?.company_identifier}/admin/payments`,
        },
        {
          name: "Discounted Services",
          linkedModule: AvailableModules.FormBuilder,
          icon: null,
          link: `/${company?.company_identifier}/admin/discounted-services`,
        },
        {
          name: "Invoices",
          linkedModule: AvailableModules.FormBuilder,
          icon: null,
          link: `/${company?.company_identifier}/admin/invoices`,
        },
      ],
    },
    {
      name: "Notifications Center",
      linkedModule: AvailableModules.Notifications,
      icon: <LuSend size={20} />,
      link: `/${company?.company_identifier}/admin/notifications-center`,
    },
    {
      name: "Media Center",
      linkedModule: AvailableModules.MediaCenter,
      icon: <GrMultimedia size={20} />,
      link: `/${company?.company_identifier}/admin/media-center`,
    },
    {
      name: "Reports",
      linkedModule: AvailableModules.FormBuilder,
      icon: <TbBrandGoogleAnalytics size={20} />,
      link: null,
      subNavigation: [
        {
          name: "Form Reports",
          linkedModule: AvailableModules.FormBuilder,
          icon: null,
          link: `/${company?.company_identifier}/admin/form-reports`,
        },
      ],
    },

    {
      name: "Company Profile",
      linkedModule: AvailableModules.CompanyProfile,
      icon: <RiListSettingsFill size={20} />,
      link: `/${company?.company_identifier}/admin/company-profile`,
    },
    {
      name: "User management",
      linkedModule: AvailableModules.UserManagement,
      icon: <FaUsers size={20} />,
      link: `/${company?.company_identifier}/admin/usermanagement`,
    },
    {
      name: "Audit Trail",
      icon: <PiListMagnifyingGlassBold size={18} />,
      link: "/company/audit-trail",
    },
  ];

  //
  useEffect(() => {
    let enabled_modules = company.companyModules;
    let temp: any = [];

    all_navigation.forEach((item) => {
      if (enabled_modules.includes(item.linkedModule)) {
        temp.push(item);
      }
    });

    // assign
    setNavigation(temp);
  }, [company]);

  const thirdPartyApps: any = [];

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
                pathname.includes("settings") ? "ml-0" : "md:ml-[20rem]"
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
