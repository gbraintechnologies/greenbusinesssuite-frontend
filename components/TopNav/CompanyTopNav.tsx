"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
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

function TopNav({ settingsLink }: { settingsLink?: string }) {
  const {
    companyAdmin,
    removeCompanyAdmin,
    companyBranding: company,
  } = useCompany();
  const { removeAuth } = useAuth();
  const router = useRouter();

  const homeHref = `/${company?.company_identifier}/admin`;
  const settingsHref =
    settingsLink ?? `/${company?.company_identifier}/admin/settings`;

  return (
    <nav className="fixed top-0 z-40 flex h-14 w-full items-center justify-between border-b border-brand-800/30 bg-gradient-to-r from-brand-700 via-brand-600 to-brand-700 px-4 shadow-[0_4px_20px_-8px_rgba(91,33,182,0.45)] sm:px-5">
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
            {company?.name || "Company Admin"}
          </p>
          <p className="hidden truncate text-[11px] text-white/70 sm:block">
            Admin workspace
          </p>
        </div>
      </div>

      <TopNavProfileMenu
        firstName={companyAdmin?.first_name}
        lastName={companyAdmin?.last_name}
        email={companyAdmin?.email}
        avatarUrl={getProfileAvatar(companyAdmin)}
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
