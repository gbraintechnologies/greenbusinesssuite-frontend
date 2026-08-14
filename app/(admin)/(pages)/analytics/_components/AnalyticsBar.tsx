"use client";

import { BarChart } from "@tremor/react";
import DashboardPanel from "@/components/Dashboard/DashboardPanel";
import type { NamedValue } from "../_data/mockAnalytics";
import { formatNumber } from "@/utils/dashboard/formatters";

type Props = {
  title: string;
  data: NamedValue[];
  color?: string;
};

export default function AnalyticsBar({
  title,
  data,
  color = "violet",
}: Props) {
  return (
    <DashboardPanel title={title}>
      <BarChart
        className="h-56"
        data={data}
        index="name"
        categories={["value"]}
        colors={[color]}
        yAxisWidth={48}
        showAnimation
        valueFormatter={(v) => formatNumber(v)}
      />
    </DashboardPanel>
  );
}
