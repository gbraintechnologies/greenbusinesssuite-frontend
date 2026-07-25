"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useUser from "@/hooks/useUser";
import useCompany from "@/hooks/useCompany";
import useAuth from "@/hooks/useAuth";
import CompanyBrandAvatar from "@/components/CompanyBrand/CompanyBrandAvatar";
import TopNavProfileMenu from "./TopNavProfileMenu";
import MobileNavToggle from "./MobileNavToggle";

function getProfileAvatar(person: any) {
  return (
    person?.custom_profile_values?.find(
      (item: any) => item.custom_profile_item_id === 1
    )?.value ?? null
  );
}

function TopNav() {
  const { user } = useUser();
  const {
    removeCompanyAdmin,
    companyBranding: company,
  } = useCompany();
  const { removeAuth } = useAuth();
  const router = useRouter();

  const brandColor = company?.color || "#7C3AED";
  const homeHref = `/${company?.company_identifier}/client/home`;
  const settingsHref = `/${company?.company_identifier}/client/settings`;

  return (
    <nav
      style={
        {
          background: `linear-gradient(90deg, ${brandColor} 0%, ${brandColor}ee 55%, ${brandColor} 100%)`,
        } as CSSProperties
      }
      className="fixed top-0 z-[100] flex h-14 w-full items-center justify-between border-b border-black/10 px-4 shadow-[0_4px_20px_-8px_rgba(15,23,42,0.35)] sm:px-5"
    >
      <div className="flex min-w-0 items-center gap-3">
        <MobileNavToggle />
        <Link
          href={homeHref}
          className="shrink-0 rounded-xl bg-white/95 p-0.5 shadow-sm transition-transform hover:scale-[1.03]"
          aria-label={`${company?.name ?? "Company"} home`}
        >
          <CompanyBrandAvatar
            logoUrl={company?.logo}
            name={company?.name}
            size="xs"
          />
        </Link>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">
            {company?.name || "Client Portal"}
          </p>
          <p className="hidden truncate text-[11px] text-white/70 sm:block">
            Client workspace
          </p>
        </div>
      </div>

      <TopNavProfileMenu
        firstName={user?.first_name}
        lastName={user?.last_name}
        email={user?.email}
        avatarUrl={getProfileAvatar(user)}
        settingsHref={settingsHref}
        onLogout={() => {
          removeCompanyAdmin();
          removeAuth();
          toast.success("Logged out");
          router.push(`/${company?.company_identifier}/auth`);
        }}
      />
    </nav>
  );
}

export default TopNav;
