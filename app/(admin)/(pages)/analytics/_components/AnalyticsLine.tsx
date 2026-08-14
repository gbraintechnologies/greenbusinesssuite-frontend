"use client";

import { AreaChart } from "@tremor/react";
import DashboardPanel from "@/components/Dashboard/DashboardPanel";
import { formatNumber } from "@/utils/dashboard/formatters";

type Props = {
  title: string;
  data: { month: string; clients: number }[];
};

export default function AnalyticsLine({ title, data }: Props) {
  return (
    <DashboardPanel title={title}>
      <AreaChart
        className="h-56"
        data={data}
        index="month"
        categories={["clients"]}
        colors={["violet"]}
        showAnimation
        curveType="natural"
        valueFormatter={(v) => formatNumber(v)}
      />
    </DashboardPanel>
  );
}
