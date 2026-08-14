"use client";

import { FiUserPlus, FiUsers } from "react-icons/fi";
import AnalyticsPageShell from "../_components/AnalyticsPageShell";
import AnalyticsKpiGrid from "../_components/AnalyticsKpiGrid";
import AnalyticsDonut from "../_components/AnalyticsDonut";
import AnalyticsBar from "../_components/AnalyticsBar";
import AnalyticsLine from "../_components/AnalyticsLine";
import RegionBreakdown from "../_components/RegionBreakdown";
import { clientsMock } from "../_data/mockAnalytics";

export default function ClientsAnalyticsPage() {
  const data = clientsMock;

  return (
    <AnalyticsPageShell
      title="Green Suite Clients"
      subtitle="Client growth, activity, and demographic breakdown"
    >
      <AnalyticsKpiGrid
        items={[
          {
            label: data.kpis[0].label,
            value: data.kpis[0].value,
            icon: <FiUsers size={18} />,
          },
          {
            label: data.kpis[1].label,
            value: data.kpis[1].value,
            icon: <FiUserPlus size={18} />,
          },
        ]}
      />

      <div className="mb-5 grid gap-4 lg:grid-cols-2">
        <AnalyticsDonut title="Active / non-active clients" data={data.active} />
        <AnalyticsDonut title="Registered / non-registered" data={data.registered} />
      </div>

      <div className="mb-5 grid gap-4 lg:grid-cols-2">
        <AnalyticsDonut title="Gender" data={data.gender} />
        <AnalyticsBar title="Age breakdown" data={data.age} />
      </div>

      <div className="mb-5 grid gap-4 lg:grid-cols-2">
        <RegionBreakdown data={data.regions} />
        <AnalyticsBar title="Sectoral breakdown" data={data.sectors} color="teal" />
      </div>

      <AnalyticsLine
        title="Monthwise analysis of new clients"
        data={data.monthwise}
      />
    </AnalyticsPageShell>
  );
}
