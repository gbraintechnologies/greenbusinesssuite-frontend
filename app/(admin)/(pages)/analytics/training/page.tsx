"use client";

import { useMemo, useState } from "react";
import { FiBookOpen } from "react-icons/fi";
import AnalyticsPageShell from "../_components/AnalyticsPageShell";
import AnalyticsKpiGrid from "../_components/AnalyticsKpiGrid";
import AnalyticsDonut from "../_components/AnalyticsDonut";
import AnalyticsBar from "../_components/AnalyticsBar";
import AnalyticsFilter from "../_components/AnalyticsFilter";
import RegionBreakdown from "../_components/RegionBreakdown";
import { TRAINING_PROGRAMS, trainingMock } from "../_data/mockAnalytics";

export default function TrainingAnalyticsPage() {
  const [programId, setProgramId] = useState("all");
  const data = useMemo(() => trainingMock(programId), [programId]);

  return (
    <AnalyticsPageShell
      title="Training"
      subtitle="Trainee demographics and distribution across training programs"
      action={
        <AnalyticsFilter
          label="Training program"
          options={TRAINING_PROGRAMS}
          value={programId}
          onChange={setProgramId}
        />
      }
    >
      <AnalyticsKpiGrid
        items={[
          {
            label: data.kpis[0].label,
            value: data.kpis[0].value,
            icon: <FiBookOpen size={18} />,
          },
        ]}
      />

      <div className="mb-5 grid gap-4 lg:grid-cols-2">
        <AnalyticsDonut title="Gender" data={data.gender} />
        <AnalyticsBar title="Age breakdown" data={data.age} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RegionBreakdown data={data.regions} />
        <AnalyticsBar title="Sector breakdown" data={data.sectors} color="teal" />
      </div>
    </AnalyticsPageShell>
  );
}
