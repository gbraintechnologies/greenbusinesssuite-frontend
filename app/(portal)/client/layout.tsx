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
      <div className="flex min-h-screen items-center justify-center bg-[#f0f4f9]">
        <AiOutlineLoading3Quarters size={24} className="animate-spin text-[#0b57d0]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f4f9] text-[#1f1f1f]">
      <header className="sticky top-0 z-[100] flex h-16 items-center justify-between border-b border-[#e3e3e3] bg-white px-4 sm:px-6">
        <Link href="/client" className="flex items-center" aria-label="Green Business Suite">
          <Image
            src="/brand/greensuite_logo_on_light.png"
            alt="Green Business Suite"
            width={180}
            height={60}
            className="h-8 w-auto"
            unoptimized
          />
        </Link>
        <TopNavProfileMenu
          tone="onLight"
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
      </header>
      <main>{children}</main>
    </div>
  );
}
