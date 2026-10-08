"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiBookOpen } from "react-icons/fi";
import services from "@/services";
import AnalyticsPageShell from "../_components/AnalyticsPageShell";
import AnalyticsKpiGrid from "../_components/AnalyticsKpiGrid";
import AnalyticsDonut from "../_components/AnalyticsDonut";
import AnalyticsBar from "../_components/AnalyticsBar";
import AnalyticsFilter from "../_components/AnalyticsFilter";
import RegionBreakdown from "../_components/RegionBreakdown";

export default function TrainingAnalyticsPage() {
  const [programId, setProgramId] = useState("all");
  const { data, isLoading, isError } = useQuery({
    queryKey: ["analytics", "training", programId],
    queryFn: () => services.getTrainingAnalytics(programId),
  });

  return (
    <AnalyticsPageShell
      title="Training"
      subtitle="Trainee demographics and distribution across training programs"
      action={
        <AnalyticsFilter
          label="Training program"
          options={data?.programs ?? [{ id: "all", label: "All programs" }]}
          value={programId}
          onChange={setProgramId}
        />
      }
    >
      {isLoading && <p className="text-sm text-slate-500">Loading analytics…</p>}
      {isError && (
        <p className="text-sm text-red-600">Could not load training analytics.</p>
      )}
      {data && (
        <>
          <AnalyticsKpiGrid
            items={[
              {
                label: data.kpis[0]?.label ?? "Total trainees",
                value: data.kpis[0]?.value ?? 0,
                icon: <FiBookOpen size={18} />,
              },
            ]}
          />

          <div className="mb-5 grid gap-4 lg:grid-cols-2">
            <AnalyticsDonut title="Gender" data={data.gender ?? []} />
            <AnalyticsBar title="Age breakdown" data={data.age ?? []} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <RegionBreakdown data={data.regions ?? []} />
            <AnalyticsBar title="Sector breakdown" data={data.sectors ?? []} color="teal" />
          </div>
        </>
      )}
    </AnalyticsPageShell>
  );
}
