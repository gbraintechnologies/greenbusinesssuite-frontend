"use client";

import { FiBriefcase, FiUsers } from "react-icons/fi";
import AnalyticsPageShell from "../_components/AnalyticsPageShell";
import AnalyticsKpiGrid from "../_components/AnalyticsKpiGrid";
import AnalyticsDonut from "../_components/AnalyticsDonut";
import AnalyticsBar from "../_components/AnalyticsBar";
import RegionBreakdown from "../_components/RegionBreakdown";
import { generalBusinessMock } from "../_data/mockAnalytics";

export default function GeneralBusinessAnalyticsPage() {
  const data = generalBusinessMock;

  return (
    <AnalyticsPageShell
      title="General Business Analysis"
      subtitle="Overall business registration and ownership metrics across Ghana"
    >
      <AnalyticsKpiGrid
        items={[
          {
            label: data.kpis[0].label,
            value: data.kpis[0].value,
            icon: <FiBriefcase size={18} />,
          },
          {
            label: data.kpis[1].label,
            value: data.kpis[1].value,
            icon: <FiUsers size={18} />,
          },
        ]}
      />

      <div className="mb-5 grid gap-4 lg:grid-cols-2">
        <AnalyticsDonut title="Registered / non-registered" data={data.registered} />
        <AnalyticsDonut title="Gender" data={data.gender} />
      </div>

      <div className="mb-5 grid gap-4 lg:grid-cols-2">
        <RegionBreakdown data={data.regions} />
        <AnalyticsBar title="Sector breakdown" data={data.sectors} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <AnalyticsDonut title="Disability" data={data.disability} />
        <AnalyticsBar title="Ownership age breakdown" data={data.ownershipAge} />
      </div>

      <div className="mt-5">
        <AnalyticsBar title="Literacy level" data={data.literacy} color="teal" />
      </div>
    </AnalyticsPageShell>
  );
}
