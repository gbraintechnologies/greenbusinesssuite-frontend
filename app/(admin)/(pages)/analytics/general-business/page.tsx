"use client";

import { useQuery } from "@tanstack/react-query";
import { FiBriefcase, FiUsers } from "react-icons/fi";
import services from "@/services";
import AnalyticsPageShell from "../_components/AnalyticsPageShell";
import AnalyticsKpiGrid from "../_components/AnalyticsKpiGrid";
import AnalyticsDonut from "../_components/AnalyticsDonut";
import AnalyticsBar from "../_components/AnalyticsBar";
import RegionBreakdown from "../_components/RegionBreakdown";

export default function GeneralBusinessAnalyticsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["analytics", "general-business"],
    queryFn: services.getGeneralBusinessAnalytics,
  });

  return (
    <AnalyticsPageShell
      title="General Business Analysis"
      subtitle="Overall business registration and ownership metrics across Ghana"
    >
      {isLoading && (
        <p className="text-sm text-slate-500">Loading analytics…</p>
      )}
      {isError && (
        <p className="text-sm text-red-600">Could not load business analytics.</p>
      )}
      {data && (
        <>
          <AnalyticsKpiGrid
            items={[
              {
                label: data.kpis[0]?.label ?? "Total businesses",
                value: data.kpis[0]?.value ?? 0,
                icon: <FiBriefcase size={18} />,
              },
              {
                label: data.kpis[1]?.label ?? "Total employees",
                value: data.kpis[1]?.value ?? 0,
                icon: <FiUsers size={18} />,
              },
            ]}
          />

          <div className="mb-5 grid gap-4 lg:grid-cols-2">
            <AnalyticsDonut title="Registered / non-registered" data={data.registered ?? []} />
            <AnalyticsDonut title="Gender" data={data.gender ?? []} />
          </div>

          <div className="mb-5 grid gap-4 lg:grid-cols-2">
            <RegionBreakdown data={data.regions ?? []} />
            <AnalyticsBar title="Sector breakdown" data={data.sectors ?? []} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <AnalyticsDonut title="Disability" data={data.disability ?? []} />
            <AnalyticsBar title="Ownership age breakdown" data={data.ownershipAge ?? []} />
          </div>

          <div className="mt-5">
            <AnalyticsBar title="Literacy level" data={data.literacy ?? []} color="teal" />
          </div>
        </>
      )}
    </AnalyticsPageShell>
  );
}
