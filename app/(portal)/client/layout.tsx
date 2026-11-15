"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  TbApps,
  TbChartBar,
  TbCurrencyDollar,
  TbDeviceLaptop,
  TbLayoutDashboard,
  TbSchool,
} from "react-icons/tb";
import useAuth from "@/hooks/useAuth";
import useUser from "@/hooks/useUser";
import useAdmin from "@/hooks/useAdmin";
import TopNavProfileMenu from "@/components/TopNav/TopNavProfileMenu";
import MobileNavToggle from "@/components/TopNav/MobileNavToggle";
import SideNav from "@/components/SideNav/SideNav";
import { MobileNavProvider } from "@/contexts/MobileNavContext";

const navigation = [
  {
    name: "Dashboard",
    icon: <TbLayoutDashboard size={20} />,
    link: "/client/dashboard",
  },
  {
    name: "Services",
    icon: <TbDeviceLaptop size={20} />,
    link: "/client/services",
  },
  {
    name: "Financial",
    icon: <TbCurrencyDollar size={20} />,
    link: "/client/financial",
  },
  {
    name: "Apps",
    icon: <TbApps size={20} />,
    link: "/client/apps",
  },
  {
    name: "Training",
    icon: <TbSchool size={20} />,
    link: "/client/training",
  },
  {
    name: "Analytics",
    icon: <TbChartBar size={20} />,
    link: "/client/analytics",
  },
];

export default function ClientPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { auth, hasHydrated, removeAuth } = useAuth();
  const { user, removeUser } = useUser();
  const { removeAdmin } = useAdmin();
  const accessToken = auth?.accessToken ?? auth?.access_token;
  const person = user ?? auth;

  useEffect(() => {
    if (!hasHydrated) return;
    if (!accessToken) {
      router.replace("/auth");
    }
  }, [hasHydrated, accessToken, router]);

  if (!hasHydrated || !accessToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <AiOutlineLoading3Quarters
          size={24}
          className="animate-spin text-brand-600"
        />
      </div>
    );
  }

  return (
    <MobileNavProvider hasSideNav>
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
        <header className="fixed top-0 z-[100] flex h-14 w-full items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <MobileNavToggle />
            <Link
              href="/client/dashboard"
              className="flex items-center"
              aria-label="Green Business Suite"
            >
              <Image
                src="/brand/greensuite_logo_on_light.png"
                alt="Green Business Suite"
                width={180}
                height={60}
                className="h-8 w-auto"
                unoptimized
              />
            </Link>
          </div>
          <TopNavProfileMenu
            tone="onLight"
            firstName={person?.firstName ?? person?.first_name}
            lastName={person?.lastName ?? person?.last_name}
            email={person?.email}
            settingsHref="/client/dashboard"
            onLogout={() => {
              removeAuth();
              removeUser();
              removeAdmin();
              toast.success("Logged out");
              router.push("/auth");
            }}
          />
        </header>

        <div className="mt-14 flex min-h-[calc(100vh-3.5rem)]">
          <SideNav
            type="client"
            navigation={navigation}
            homeHref="/client/dashboard"
            brandTitle="Green Business Suite"
            brandSubtitle="Client Portal"
          />
          <main className="min-w-0 w-full md:ml-[17.5rem]">{children}</main>
        </div>
      </div>
    </MobileNavProvider>
  );
}
