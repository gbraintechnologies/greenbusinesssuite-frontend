"use client";

import Link from "next/link";
import Image from "next/image";
import { Fragment, useState } from "react";
import { Menu, MenuButton, MenuItems, MenuItem, Transition } from "@headlessui/react";
import { FiChevronDown, FiLogOut, FiSettings, FiUser } from "react-icons/fi";
import Modal from "../Modal/Modal";

type Props = {
  firstName?: string;
  lastName?: string;
  email?: string;
  avatarUrl?: string | null;
  settingsHref: string;
  onLogout: () => void;
};

function getInitials(firstName?: string, lastName?: string) {
  const first = firstName?.[0]?.toUpperCase() ?? "";
  const last = lastName?.[0]?.toUpperCase() ?? "";
  return `${first}${last}` || "U";
}

function hasAvatar(url?: string | null) {
  if (!url) return false;
  const trimmed = url.trim();
  return trimmed.length > 1 && trimmed !== "null" && trimmed !== "undefined";
}

export default function TopNavProfileMenu({
  firstName,
  lastName,
  email,
  avatarUrl,
  settingsHref,
  onLogout,
}: Props) {
  const [showLogOutModal, setShowLogOutModal] = useState(false);

  const displayName =
    [firstName, lastName].filter(Boolean).join(" ") || "Account";

  return (
    <>
      <Menu as="div" className="relative">
        <MenuButton className="group flex items-center gap-2 rounded-full border border-white/20 bg-white/10 py-1 pl-1 pr-2.5 transition-all hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-semibold text-brand-700 shadow-sm">
            {hasAvatar(avatarUrl) ? (
              <Image
                alt={displayName}
                src={avatarUrl!}
                priority
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover ring-2 ring-white/30"
              />
            ) : (
              getInitials(firstName, lastName) || "··"
            )}
          </span>
          <span className="hidden max-w-[140px] truncate text-left sm:block">
            <span className="block text-xs font-semibold leading-tight text-white">
              {displayName}
            </span>
            <span className="block truncate text-[10px] leading-tight text-white/70">
              {email ?? ""}
            </span>
          </span>
          <FiChevronDown size={14} className="shrink-0 text-white/80" />
        </MenuButton>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <MenuItems className="absolute right-0 z-50 mt-2 w-56 origin-top-right overflow-hidden rounded-2xl border border-slate-200 bg-white py-1 shadow-xl ring-1 ring-black/5 focus:outline-none">
            <div className="border-b border-slate-100 px-4 py-3 sm:hidden">
              <p className="truncate text-sm font-semibold text-slate-900">
                {displayName}
              </p>
              <p className="truncate text-xs text-slate-500">{email ?? ""}</p>
            </div>

            <MenuItem>
              {({ active }) => (
                <Link
                  href={settingsHref}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm ${
                    active
                      ? "bg-brand-50 text-brand-700"
                      : "text-slate-700"
                  }`}
                >
                  <FiUser size={16} className="text-slate-400" />
                  Profile
                </Link>
              )}
            </MenuItem>

            <MenuItem>
              {({ active }) => (
                <Link
                  href={settingsHref}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm ${
                    active
                      ? "bg-brand-50 text-brand-700"
                      : "text-slate-700"
                  }`}
                >
                  <FiSettings size={16} className="text-slate-400" />
                  Settings
                </Link>
              )}
            </MenuItem>

            <div className="my-1 border-t border-slate-100" />

            <MenuItem>
              {({ active }) => (
                <button
                  type="button"
                  onClick={() => setShowLogOutModal(true)}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm ${
                    active ? "bg-red-50 text-red-600" : "text-red-600"
                  }`}
                >
                  <FiLogOut size={16} />
                  Log out
                </button>
              )}
            </MenuItem>
          </MenuItems>
        </Transition>
      </Menu>

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
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700"
              onClick={() => {
                setShowLogOutModal(false);
                onLogout();
              }}
            >
              Yes, log out
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
