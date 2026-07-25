"use client";

import { FiMenu } from "react-icons/fi";
import { useMobileNav } from "@/contexts/MobileNavContext";

/**
 * Hamburger that opens the SideNav drawer. Hidden from `md` up, where the
 * sidebar is permanently visible.
 */
export default function MobileNavToggle() {
  const { toggle, isOpen, hasSideNav } = useMobileNav();

  if (!hasSideNav) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle navigation menu"
      aria-expanded={isOpen}
      className="-ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/25 bg-white/10 text-white transition-colors hover:bg-white/20 md:hidden"
    >
      <FiMenu size={18} />
    </button>
  );
}
