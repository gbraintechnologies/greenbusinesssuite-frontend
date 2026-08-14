"use client";

import { DonutChart } from "@tremor/react";
import DashboardPanel from "@/components/Dashboard/DashboardPanel";
import type { NamedValue } from "../_data/mockAnalytics";
import { formatNumber } from "@/utils/dashboard/formatters";

const COLORS = [
  "#7C3AED",
  "#16C8C7",
  "#3B82F6",
  "#F59E0B",
  "#EF4444",
  "#10B981",
  "#F472B6",
  "#64748B",
];

type Props = {
  title: string;
  data: NamedValue[];
};

export default function AnalyticsDonut({ title, data }: Props) {
  return (
    <DashboardPanel title={title}>
      <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-xs text-slate-500">{item.name}</span>
            <span className="text-xs font-semibold text-slate-800">
              {formatNumber(item.value)}
            </span>
          </div>
        ))}
      </div>
      <DonutChart
        className="h-48"
        data={data}
        category="value"
        index="name"
        colors={COLORS.slice(0, data.length)}
        showAnimation
        valueFormatter={(v) => formatNumber(v)}
      />
    </DashboardPanel>
  );
}
