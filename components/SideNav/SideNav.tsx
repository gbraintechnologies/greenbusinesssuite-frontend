"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { Disclosure } from "@headlessui/react";
import clsx from "clsx";
import { FiChevronDown, FiX } from "react-icons/fi";
import MeshSuiteMark from "@/public/icons/MeshSuiteMark";
import { useMobileNav } from "@/contexts/MobileNavContext";

export type NavItem = {
  name: string;
  icon?: React.ReactNode;
  link?: string | string[] | null;
  subNavigation?: NavItem[];
  linkedModule?: string;
};

type SideNavProps = {
  navigation: NavItem[];
  type?: "normal" | "client";
  thirdPartyApps?: NavItem[];
  homeHref?: string;
  brandTitle?: string;
  brandSubtitle?: string;
};

function resolveLink(link?: string | string[] | null) {
  if (!link) return "";
  return Array.isArray(link) ? link[0] : link;
}

function isLinkActive(pathname: string, link?: string | string[] | null) {
  if (!link) return false;

  if (Array.isArray(link)) {
    return link.some(
      (entry) =>
        pathname === entry ||
        pathname.startsWith(`${entry}/`) ||
        pathname.includes(entry)
    );
  }

  if (link === "/") {
    return pathname === "/";
  }

  return (
    pathname === link ||
    pathname.startsWith(`${link}/`) ||
    pathname.includes(link)
  );
}

function isGroupActive(pathname: string, items: NavItem[] = []) {
  return items.some((item) => isLinkActive(pathname, item.link));
}

function NavIcon({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <span
      className={clsx(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors [&>svg]:h-[18px] [&>svg]:w-[18px]",
        active
          ? "bg-brand-600 text-white shadow-sm shadow-brand-600/30"
          : "bg-slate-100 text-slate-500 group-hover:bg-brand-100 group-hover:text-brand-600"
      )}
    >
      {children}
    </span>
  );
}

function NavLeaf({
  item,
  pathname,
  nested = false,
}: {
  item: NavItem;
  pathname: string;
  nested?: boolean;
}) {
  const href = resolveLink(item.link);
  if (!href) return null;

  const active = isLinkActive(pathname, item.link);

  return (
    <Link href={href} className="group block">
      <div
        className={clsx(
          "relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-all",
          nested && "ml-2 pl-3",
          active
            ? "bg-brand-50 text-brand-700"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        )}
      >
        {active && (
          <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand-600" />
        )}
        {!nested && item.icon ? (
          <NavIcon active={active}>{item.icon}</NavIcon>
        ) : nested ? (
          <span
            className={clsx(
              "h-1.5 w-1.5 shrink-0 rounded-full",
              active ? "bg-brand-600" : "bg-slate-300 group-hover:bg-brand-400"
            )}
          />
        ) : null}
        <span className="truncate">{item.name}</span>
      </div>
    </Link>
  );
}

function NavGroup({ item, pathname }: { item: NavItem; pathname: string }) {
  const groupActive = isGroupActive(pathname, item.subNavigation);

  return (
    <Disclosure defaultOpen={groupActive}>
      {({ open }) => (
        <div>
          <Disclosure.Button
            className={clsx(
              "group flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm font-medium transition-all",
              groupActive
                ? "bg-brand-50 text-brand-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <div className="flex min-w-0 items-center gap-2.5">
              {item.icon && <NavIcon active={groupActive}>{item.icon}</NavIcon>}
              <span className="truncate">{item.name}</span>
            </div>
            <FiChevronDown
              size={15}
              className={clsx(
                "shrink-0 text-slate-400 transition-transform duration-200",
                open && "rotate-180 text-brand-600"
              )}
            />
          </Disclosure.Button>

          <Disclosure.Panel className="mt-0.5 space-y-0.5 border-l border-slate-200/80 ml-4 pl-2">
            {item.subNavigation?.map((sub, index) => (
              <NavLeaf
                key={`${sub.name}-${index}`}
                item={sub}
                pathname={pathname}
                nested
              />
            ))}
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
}

function SideNav({
  navigation,
  type = "normal",
  thirdPartyApps = [],
  homeHref = "/",
  brandTitle = "MeshSuite",
  brandSubtitle,
}: SideNavProps) {
  const pathname = usePathname();
  const { isOpen, close } = useMobileNav();
  const sectionLabel = type === "client" ? "Menu" : "Organization";
  const subtitle =
    brandSubtitle ?? (type === "client" ? "Client Portal" : "Admin Console");

  return (
    <>
      {/* Backdrop — mobile drawer only */}
      <div
        onClick={close}
        aria-hidden="true"
        className={clsx(
          "fixed inset-0 top-[3.5rem] z-30 bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-200 md:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <aside
        className={clsx(
          "fixed bottom-0 left-0 top-[3.5rem] z-40 flex w-[17.5rem] max-w-[85vw] flex-col overflow-hidden border-r border-slate-200/80 bg-white shadow-[4px_0_24px_-12px_rgba(15,23,42,0.12)]",
          "transition-transform duration-300 ease-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand */}
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
          <Link href={homeHref} className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm shadow-brand-600/25">
              <MeshSuiteMark className="h-5 w-5" color="#FFFFFF" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900">
                {brandTitle}
              </p>
              <p className="truncate text-[10px] font-medium uppercase tracking-wider text-slate-400">
                {subtitle}
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={close}
            aria-label="Close navigation menu"
            className="-mr-1 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 md:hidden"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Menu — scrolls only when it can't fit (short/mobile viewports) */}
        <nav className="flex flex-1 flex-col overflow-y-auto px-2.5 py-3">
        <p className="mb-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          {sectionLabel}
        </p>

        <ul className="space-y-0.5">
          {navigation.map((item, index) => (
            <li key={`${item.name}-${index}`}>
              {item.subNavigation?.length ? (
                <NavGroup item={item} pathname={pathname} />
              ) : (
                <NavLeaf item={item} pathname={pathname} />
              )}
            </li>
          ))}
        </ul>

        {type === "normal" && thirdPartyApps.length > 0 && (
          <div className="mt-4">
            <p className="mb-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Integrations
            </p>
            <ul className="space-y-0.5">
              {thirdPartyApps.map((item, index) => {
                const href = resolveLink(item.link);
                const active = isLinkActive(pathname, item.link);

                return (
                  <li key={`third-${item.name}-${index}`}>
                    <Link href={href || "#"} className="group block">
                      <div
                        className={clsx(
                          "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-all",
                          active
                            ? "bg-brand-50 text-brand-700"
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                        )}
                      >
                        {item.icon && (
                          <NavIcon active={active}>{item.icon}</NavIcon>
                        )}
                        <span className="truncate">{item.name}</span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

          {/* Footer stays with the menu — no separate scroll */}
          <div className="mt-auto pt-3">
            <div className="rounded-xl bg-gradient-to-br from-brand-50 to-violet-50 px-3 py-2.5 ring-1 ring-brand-100">
              <p className="text-xs font-semibold text-brand-800">Need help?</p>
              <p className="mt-0.5 text-[11px] leading-snug text-slate-500">
                Contact support for setup assistance.
              </p>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}

export default SideNav;
