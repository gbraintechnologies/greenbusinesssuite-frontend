"use client";

import { useMemo, useState } from "react";
import { FiDollarSign, FiUsers } from "react-icons/fi";
import AnalyticsPageShell from "../_components/AnalyticsPageShell";
import AnalyticsKpiGrid from "../_components/AnalyticsKpiGrid";
import AnalyticsDonut from "../_components/AnalyticsDonut";
import AnalyticsBar from "../_components/AnalyticsBar";
import AnalyticsFilter from "../_components/AnalyticsFilter";
import RegionBreakdown from "../_components/RegionBreakdown";
import {
  LOAN_GRANT_PROGRAMS,
  loansGrantsMock,
} from "../_data/mockAnalytics";

export default function LoansGrantsAnalyticsPage() {
  const [programId, setProgramId] = useState("all");
  const data = useMemo(() => loansGrantsMock(programId), [programId]);

  return (
    <AnalyticsPageShell
      title="Loans & Grants"
      subtitle="Beneficiary and disbursement analytics by loan or grant program"
      action={
        <AnalyticsFilter
          label="Program"
          options={LOAN_GRANT_PROGRAMS}
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
            icon: <FiUsers size={18} />,
          },
          {
            label: data.kpis[1].label,
            value: data.kpis[1].value,
            isCurrency: true,
            icon: <FiDollarSign size={18} />,
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
        <AnalyticsBar title="Age breakdown" data={data.age} />
      </div>
    </AnalyticsPageShell>
  );
}
