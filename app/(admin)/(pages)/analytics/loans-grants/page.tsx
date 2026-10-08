"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiDollarSign, FiUsers } from "react-icons/fi";
import services from "@/services";
import AnalyticsPageShell from "../_components/AnalyticsPageShell";
import AnalyticsKpiGrid from "../_components/AnalyticsKpiGrid";
import AnalyticsDonut from "../_components/AnalyticsDonut";
import AnalyticsBar from "../_components/AnalyticsBar";
import AnalyticsFilter from "../_components/AnalyticsFilter";
import RegionBreakdown from "../_components/RegionBreakdown";

export default function LoansGrantsAnalyticsPage() {
  const [programId, setProgramId] = useState("all");
  const { data, isLoading, isError } = useQuery({
    queryKey: ["analytics", "loans-grants", programId],
    queryFn: () => services.getLoansGrantsAnalytics(programId),
  });

  return (
    <AnalyticsPageShell
      title="Loans & Grants"
      subtitle="Beneficiary and disbursement analytics by loan or grant program"
      action={
        <AnalyticsFilter
          label="Program"
          options={data?.programs ?? [{ id: "all", label: "All programs" }]}
          value={programId}
          onChange={setProgramId}
        />
      }
    >
      {isLoading && <p className="text-sm text-slate-500">Loading analytics…</p>}
      {isError && (
        <p className="text-sm text-red-600">Could not load loans and grants analytics.</p>
      )}
      {data && (
        <>
          <AnalyticsKpiGrid
            items={[
              {
                label: data.kpis[0]?.label ?? "Total beneficiaries",
                value: data.kpis[0]?.value ?? 0,
                icon: <FiUsers size={18} />,
              },
              {
                label: data.kpis[1]?.label ?? "Total disbursed",
                value: data.kpis[1]?.value ?? 0,
                isCurrency: data.kpis[1]?.isCurrency ?? true,
                icon: <FiDollarSign size={18} />,
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
            <AnalyticsBar title="Age breakdown" data={data.age ?? []} />
          </div>
        </>
      )}
    </AnalyticsPageShell>
  );
}
