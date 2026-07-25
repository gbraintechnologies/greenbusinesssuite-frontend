"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { HiOutlineUser } from "react-icons/hi2";
import { GoShieldLock } from "react-icons/go";
import { FiKey, FiLogOut } from "react-icons/fi";
import { toast } from "sonner";
import Modal from "@/components/Modal/Modal";
import useAuth from "@/hooks/useAuth";
import useAdmin from "@/hooks/useAdmin";

function getAvatarUrl(admin: any) {
  return (
    admin?.custom_profile_values?.find(
      (item: any) => item.custom_profile_item_id === 1
    )?.value ??
    admin?.customProfileValues?.find(
      (item: any) => item.custom_profile_item_id === 1 || item.customProfileItemId === 1
    )?.value ??
    null
  );
}

function getInitials(admin: any) {
  const first = (admin?.first_name ?? admin?.firstName ?? "")[0] ?? "";
  const last = (admin?.last_name ?? admin?.lastName ?? "")[0] ?? "";
  return `${first}${last}`.toUpperCase() || "U";
}

function SettingsSideNav() {
  const { admin, setAdmin } = useAdmin();
  const { removeAuth } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showLogOutModal, setShowLogOutModal] = useState(false);

  const navigation = [
    {
      name: "Account",
      description: "Profile & contact details",
      icon: <HiOutlineUser size={18} />,
      link: "/settings",
    },
    {
      name: "Security",
      description: "Password & sign-in",
      icon: <GoShieldLock size={18} />,
      link: "/settings/security",
    },
    {
      name: "Access",
      description: "Roles & permissions",
      icon: <FiKey size={18} />,
      link: "/settings/access",
    },
  ];

  const avatarUrl = getAvatarUrl(admin);
  const displayName = [
    admin?.first_name ?? admin?.firstName,
    admin?.last_name ?? admin?.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <aside className="sticky top-20 h-fit w-full shrink-0 lg:w-72">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-br from-brand-600 to-brand-700 px-5 py-6 text-white">
          <div className="flex items-center gap-3">
            {avatarUrl && String(avatarUrl).length > 1 ? (
              <Image
                alt="profile"
                src={avatarUrl}
                width={56}
                height={56}
                className="h-14 w-14 rounded-2xl object-cover ring-2 ring-white/30"
                unoptimized
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-base font-semibold ring-2 ring-white/30">
                {getInitials(admin)}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-base font-semibold">
                {displayName || "Your account"}
              </p>
              <p className="truncate text-xs text-white/75">
                {admin?.email || "Personal settings"}
              </p>
            </div>
          </div>
        </div>

        <nav className="space-y-1 p-3">
          {navigation.map((item) => {
            const active = pathname === item.link;
            return (
              <Link
                key={item.name}
                href={item.link}
                className={`flex items-start gap-3 rounded-xl px-3 py-2.5 transition-all ${
                  active
                    ? "bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-100"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    active
                      ? "bg-brand-600 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {item.icon}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">{item.name}</span>
                  <span
                    className={`block text-xs ${
                      active ? "text-brand-600/80" : "text-slate-400"
                    }`}
                  >
                    {item.description}
                  </span>
                </span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => setShowLogOutModal(true)}
            className="mt-2 flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left text-red-600 transition-all hover:bg-red-50"
          >
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
              <FiLogOut size={18} />
            </span>
            <span>
              <span className="block text-sm font-semibold">Log out</span>
              <span className="block text-xs text-red-400">
                End this session
              </span>
            </span>
          </button>
        </nav>
      </div>

      <Modal
        isOpen={showLogOutModal}
        setIsOpen={setShowLogOutModal}
        title="Log out of your account"
      >
        <div>
          <p className="mt-5 px-5 text-sm text-slate-600">
            This will end your current session. You&apos;ll need to sign in again
            to access your account.
          </p>
          <div className="mt-5 flex justify-between border-t border-slate-200 bg-slate-50 p-5">
            <button
              type="button"
              onClick={() => setShowLogOutModal(false)}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-red-700"
              onClick={() => {
                setShowLogOutModal(false);
                setAdmin(null);
                removeAuth();
                toast.success("Logged out");
                router.push("/");
              }}
            >
              Yes, log out
            </button>
          </div>
        </div>
      </Modal>
    </aside>
  );
}

export default SettingsSideNav;
