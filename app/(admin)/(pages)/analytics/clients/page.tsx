"use client";

import { useQuery } from "@tanstack/react-query";
import { FiUserPlus, FiUsers } from "react-icons/fi";
import services from "@/services";
import AnalyticsPageShell from "../_components/AnalyticsPageShell";
import AnalyticsKpiGrid from "../_components/AnalyticsKpiGrid";
import AnalyticsDonut from "../_components/AnalyticsDonut";
import AnalyticsBar from "../_components/AnalyticsBar";
import AnalyticsLine from "../_components/AnalyticsLine";
import RegionBreakdown from "../_components/RegionBreakdown";

export default function ClientsAnalyticsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["analytics", "clients"],
    queryFn: services.getClientsAnalytics,
  });

  return (
    <AnalyticsPageShell
      title="Green Suite Clients"
      subtitle="Client growth, activity, and demographic breakdown"
    >
      {isLoading && <p className="text-sm text-slate-500">Loading analytics…</p>}
      {isError && (
        <p className="text-sm text-red-600">Could not load client analytics.</p>
      )}
      {data && (
        <>
          <AnalyticsKpiGrid
            items={[
              {
                label: data.kpis[0]?.label ?? "Total clients",
                value: data.kpis[0]?.value ?? 0,
                icon: <FiUsers size={18} />,
              },
              {
                label: data.kpis[1]?.label ?? "New clients this month",
                value: data.kpis[1]?.value ?? 0,
                icon: <FiUserPlus size={18} />,
              },
            ]}
          />

          <div className="mb-5 grid gap-4 lg:grid-cols-2">
            <AnalyticsDonut title="Active / non-active clients" data={data.active ?? []} />
            <AnalyticsDonut title="Registered / non-registered" data={data.registered ?? []} />
          </div>

          <div className="mb-5 grid gap-4 lg:grid-cols-2">
            <AnalyticsDonut title="Gender" data={data.gender ?? []} />
            <AnalyticsBar title="Age breakdown" data={data.age ?? []} />
          </div>

          <div className="mb-5 grid gap-4 lg:grid-cols-2">
            <RegionBreakdown data={data.regions ?? []} />
            <AnalyticsBar title="Sectoral breakdown" data={data.sectors ?? []} color="teal" />
          </div>

          <AnalyticsLine
            title="Monthwise analysis of new clients"
            data={data.monthwise ?? []}
          />
        </>
      )}
    </AnalyticsPageShell>
  );
}
