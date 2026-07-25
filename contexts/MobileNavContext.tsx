"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname } from "next/navigation";

type MobileNavContextValue = {
  isOpen: boolean;
  /** False on pages that render no sidebar, so the hamburger can hide itself. */
  hasSideNav: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const MobileNavContext = createContext<MobileNavContextValue>({
  isOpen: false,
  hasSideNav: false,
  open: () => {},
  close: () => {},
  toggle: () => {},
});

export function MobileNavProvider({
  children,
  hasSideNav = true,
}: {
  children: React.ReactNode;
  hasSideNav?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  // Close the drawer whenever navigation happens
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close on Escape, and lock body scroll while the drawer is open
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const value = useMemo(
    () => ({ isOpen, hasSideNav, open, close, toggle }),
    [isOpen, hasSideNav, open, close, toggle]
  );

  return (
    <MobileNavContext.Provider value={value}>
      {children}
    </MobileNavContext.Provider>
  );
}

export const useMobileNav = () => useContext(MobileNavContext);
