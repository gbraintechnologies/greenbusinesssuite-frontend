"use client";

import { AreaChart } from "@tremor/react";
import { Spinner } from "@heroui/react";
import DashboardPanel from "./DashboardPanel";

type Props = {
  data: { month: string; revenue: number }[];
  isLoading?: boolean;
};

export default function RevenueChart({ data, isLoading }: Props) {
  return (
    <DashboardPanel title="Revenue">
      {isLoading ? (
        <div className="flex h-56 items-center justify-center">
          <Spinner color="primary" />
        </div>
      ) : (
        <AreaChart
          className="h-56"
          data={data}
          index="month"
          categories={["revenue"]}
          colors={["violet"]}
          valueFormatter={(value: number) => `Ghs ${value.toLocaleString()}`}
          showAnimation
          curveType="natural"
        />
      )}
    </DashboardPanel>
  );
}
