"use client";

import DashboardPanel from "@/components/Dashboard/DashboardPanel";
import type { NamedValue } from "../_data/mockAnalytics";
import { formatNumber } from "@/utils/dashboard/formatters";

type Props = {
  title?: string;
  data: NamedValue[];
};

/** Regional breakdown placeholder until a Ghana geo map is available. */
export default function RegionBreakdown({
  title = "Regional & district breakdown",
  data,
}: Props) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <DashboardPanel
      title={title}
      action={
        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-amber-700">
          Map placeholder
        </span>
      }
    >
      <p className="mb-4 text-xs text-slate-500">
        Ghana region totals shown as intensity bars. Replace with a region /
        district map when geo assets are ready.
      </p>
      <div className="space-y-3">
        {data.map((region) => {
          const pct = Math.round((region.value / max) * 100);
          return (
            <div key={region.name}>
              <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                <span className="truncate text-slate-700">{region.name}</span>
                <span className="shrink-0 font-semibold text-slate-900">
                  {formatNumber(region.value)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-brand-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </DashboardPanel>
  );
}
