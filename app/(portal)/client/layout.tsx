"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import useAuth from "@/hooks/useAuth";
import useUser from "@/hooks/useUser";
import useAdmin from "@/hooks/useAdmin";
import TopNavProfileMenu from "@/components/TopNav/TopNavProfileMenu";

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
      <div className="flex min-h-screen items-center justify-center bg-surface-muted">
        <AiOutlineLoading3Quarters size={24} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-muted">
      <nav className="fixed top-0 z-[100] flex h-14 w-full items-center justify-between border-b border-brand-800/30 bg-gradient-to-r from-brand-700 via-brand-600 to-brand-700 px-4 shadow-[0_4px_20px_-8px_rgba(91,33,182,0.45)] sm:px-5">
        <Link href="/client" className="flex items-center" aria-label="Client portal">
          <Image
            src="/brand/greensuite_logo_white.png"
            alt="Green Business Suite"
            width={180}
            height={60}
            className="h-9 w-auto"
            unoptimized
          />
        </Link>
        <TopNavProfileMenu
          firstName={person?.firstName ?? person?.first_name}
          lastName={person?.lastName ?? person?.last_name}
          email={person?.email}
          settingsHref="/client"
          onLogout={() => {
            removeAuth();
            removeUser();
            removeAdmin();
            toast.success("Logged out");
            router.push("/auth");
          }}
        />
      </nav>
      <div className="pt-14">{children}</div>
    </div>
  );
}
