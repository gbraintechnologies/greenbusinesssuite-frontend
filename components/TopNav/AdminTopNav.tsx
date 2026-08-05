"use client";

import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useAdmin from "@/hooks/useAdmin";
import useAuth from "@/hooks/useAuth";
import TopNavProfileMenu from "./TopNavProfileMenu";
import MobileNavToggle from "./MobileNavToggle";

function getProfileAvatar(admin: any) {
  return (
    admin?.custom_profile_values?.find(
      (item: any) => item.custom_profile_item_id === 1
    )?.value ?? null
  );
}

function TopNav({ settingsLink }: { settingsLink?: string }) {
  const { admin } = useAdmin();
  const { removeAuth } = useAuth();
  const router = useRouter();

  return (
    <nav className="fixed top-0 z-[100] flex h-14 w-full items-center justify-between border-b border-brand-800/30 bg-gradient-to-r from-brand-700 via-brand-600 to-brand-700 px-4 shadow-[0_4px_20px_-8px_rgba(91,33,182,0.45)] sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <MobileNavToggle />
        <Link
          href="/"
          className="flex shrink-0 items-center rounded-xl bg-white px-2.5 py-1.5 shadow-sm transition-transform hover:scale-[1.03]"
          aria-label="MeshSuite home"
        >
          <Image
            src="/svg/mesh_logo.svg"
            alt="MeshSuite"
            width={120}
            height={40}
            className="h-7 w-auto"
            unoptimized
            priority
          />
        </Link>
        <div className="min-w-0">
          <p className="hidden truncate text-[11px] text-white/70 sm:block">
            Platform Administrator
          </p>
        </div>
      </div>

      <TopNavProfileMenu
        firstName={admin?.first_name}
        lastName={admin?.last_name}
        email={admin?.email}
        avatarUrl={getProfileAvatar(admin)}
        settingsHref={settingsLink ?? "/settings"}
        onLogout={() => {
          removeAuth();
          toast.success("Logged out");
          router.push("/");
        }}
      />
    </nav>
  );
}

export default TopNav;
