"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface GlobalTabsClassNames {
  base?: string;
  tabList?: string;
  tab?: string;
  panel?: string;
}

interface GlobalTabsProps {
  defaultTab?: string;
  queryParam?: string;
  /**
   * If true, syncs tab state with URL (causes ~1s delay on tab switch)
   * If false, uses local state only (instant tab switching)
   * @default false
   */
  syncWithUrl?: boolean;
  children: React.ReactNode;
  classNames?: GlobalTabsClassNames;
  "aria-label"?: string;
}

interface TabDescriptor {
  key: string;
  title: React.ReactNode;
  content: React.ReactNode;
}

function GlobalTabs({
  defaultTab,
  queryParam = "tab",
  syncWithUrl = false,
  children,
  classNames,
  "aria-label": ariaLabel = "Options",
}: GlobalTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabs = useMemo<TabDescriptor[]>(() => {
    return React.Children.toArray(children)
      .filter((child): child is React.ReactElement => React.isValidElement(child))
      .map((child, index) => {
        const props = child.props as {
          title?: React.ReactNode;
          children?: React.ReactNode;
        };

        return {
          // React prefixes keys of array children with ".$"
          key:
            child.key != null
              ? String(child.key).replace(/^\.\$/, "")
              : `tab-${index}`,
          title: props.title,
          content: props.children,
        };
      });
  }, [children]);

  const fallbackTab = defaultTab ?? tabs[0]?.key;

  const [selectedTab, setSelectedTab] = useState<string | undefined>(
    syncWithUrl ? searchParams.get(queryParam) || fallbackTab : fallbackTab
  );

  useEffect(() => {
    if (!syncWithUrl) return;
    const tabFromUrl = searchParams.get(queryParam);
    if (tabFromUrl && tabFromUrl !== selectedTab) {
      setSelectedTab(tabFromUrl);
    }
  }, [searchParams, queryParam, selectedTab, syncWithUrl]);

  const activeTab =
    tabs.find((tab) => tab.key === selectedTab) ?? tabs[0] ?? undefined;

  const handleTabChange = (key: string) => {
    setSelectedTab(key);

    if (!syncWithUrl) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set(queryParam, key);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className={classNames?.base ?? "w-full max-w-full"}>
      <div
        role="tablist"
        aria-label={ariaLabel}
        className={
          classNames?.tabList ??
          "no-scrollbar flex w-full flex-nowrap gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50 p-1"
        }
      >
        {tabs.map((tab) => {
          const isSelected = tab.key === activeTab?.key;

          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={`panel-${tab.key}`}
              id={`tab-${tab.key}`}
              onClick={() => handleTabChange(tab.key)}
              className={[
                "h-10 shrink-0 whitespace-nowrap rounded-xl px-4 text-sm font-medium transition-colors",
                isSelected
                  ? "bg-brand-600 font-semibold text-white shadow-sm"
                  : "text-slate-600 hover:bg-white hover:text-slate-900",
                classNames?.tab ?? "",
              ].join(" ")}
            >
              {tab.title}
            </button>
          );
        })}
      </div>

      {activeTab && (
        <div
          role="tabpanel"
          id={`panel-${activeTab.key}`}
          aria-labelledby={`tab-${activeTab.key}`}
          className={classNames?.panel ?? "px-0 pt-6"}
        >
          {activeTab.content}
        </div>
      )}
    </div>
  );
}

export default GlobalTabs;
