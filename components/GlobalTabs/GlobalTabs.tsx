"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsProps } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";

interface GlobalTabsProps
  extends Omit<TabsProps, "selectedKey" | "onSelectionChange"> {
  defaultTab?: string;
  queryParam?: string;
  /**
   * If true, syncs tab state with URL (causes ~1s delay on tab switch)
   * If false, uses local state only (instant tab switching)
   * @default false
   */
  syncWithUrl?: boolean;
}

/**
 * GlobalTabs - A wrapper around NextUI's Tabs component with optional URL sync
 *
 * Features:
 * - Fast local state management (instant tab switching by default)
 * - Optional URL query parameter sync (set syncWithUrl={true})
 * - Maintains all NextUI Tabs props and children structure
 * - Pre-configured with default styling from globalTabStyle (can be overridden)
 *
 * Usage (Fast mode - default):
 * ```tsx
 * <GlobalTabs defaultTab="reports">
 *   <Tab key="reports" title="Reports">
 *     <ReportsContent />
 *   </Tab>
 *   <Tab key="settings" title="Settings">
 *     <SettingsContent />
 *   </Tab>
 * </GlobalTabs>
 * ```
 *
 * Usage (URL sync mode):
 * ```tsx
 * <GlobalTabs defaultTab="reports" syncWithUrl={true} queryParam="tab">
 *   <Tab key="reports" title="Reports">
 *     <ReportsContent />
 *   </Tab>
 *   <Tab key="settings" title="Settings">
 *     <SettingsContent />
 *   </Tab>
 * </GlobalTabs>
 * ```
 *
 * @param defaultTab - The default tab key to show (defaults to first child's key)
 * @param queryParam - The URL query parameter name (defaults to "tab", only used if syncWithUrl is true)
 * @param syncWithUrl - Whether to sync tab state with URL query params (default: false)
 * @param children - NextUI Tab components
 * @param ...props - All other NextUI Tabs props are passed through and can override defaults
 */
function GlobalTabs({
  defaultTab,
  queryParam = "tab",
  syncWithUrl = false,
  children,
  ...props
}: GlobalTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state based on mode
  const [selectedTab, setSelectedTab] = useState<string | undefined>(
    syncWithUrl ? searchParams.get(queryParam) || defaultTab : defaultTab
  );

  // Update local state when URL changes (only in URL sync mode)
  useEffect(() => {
    const tabFromUrl = searchParams.get(queryParam);
    if (tabFromUrl && tabFromUrl !== selectedTab) {
      setSelectedTab(tabFromUrl);
    }
  }, [searchParams]);

  const handleTabChange = (key: React.Key) => {
    const newTab = key.toString();

    // Always update local state (instant)
    setSelectedTab(newTab);

    // Also update URL (with delay)
    setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(queryParam, newTab);
      router.push(`?${params.toString()}`, { scroll: false });
    }, 100);
  };

  return (
    <Tabs
      fullWidth={false}
      size="md"
      color="primary"
      radius="lg"
      classNames={{
        cursor: "w-full font-semibold",
        tab: "px-5 py-5",
        tabList: "border shadow-none",
        base: "[data-selected=true]:text-white text-white font-semibold",
        tabContent: "active:text-white",
      }}
      variant="bordered"
      aria-label="Options"
      {...props}
      selectedKey={selectedTab}
      onSelectionChange={handleTabChange}
    >
      {children}
    </Tabs>
  );
}

export default GlobalTabs;
