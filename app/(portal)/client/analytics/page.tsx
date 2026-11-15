"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { DonutChart } from "@tremor/react";
import services from "@/services";
import useUser from "@/hooks/useUser";
import StatsBlock from "@/components/StatsBlock/StatsBlock";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";

export default function ClientAnalyticsPage() {
  const { user } = useUser();
  const userId = user?.id;

  const { data: formsStats, isLoading } = useQuery({
    queryKey: ["get forms statistics for user", userId],
    queryFn: services.getFormStatisticsForUser(userId),
    enabled: Boolean(userId),
  });

  const completed = Number(formsStats?.completedForms ?? 0);
  const incomplete = Number(formsStats?.uncompletedForms ?? 0);
  const total = completed + incomplete;

  const donutData = useMemo(() => {
    if (total === 0) {
      return [{ name: "No applications yet", value: 1 }];
    }
    return [
      { name: "Submitted", value: completed },
      { name: "Incomplete", value: incomplete },
    ];
  }, [completed, incomplete, total]);

  const colors = total === 0 ? ["#E2E8F0"] : ["#1FA35C", "#94A3B8"];

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <LoadingIcon />
      </div>
    );
  }

  return (
    <div className="px-5 py-6 pb-16 sm:px-8">
      <h1 className="text-xl font-semibold text-slate-900">Analytics</h1>
      <p className="mt-1 max-w-2xl text-sm text-slate-500">
        A snapshot of your applications and progress.
      </p>

      <div className="mt-6">
        <StatsBlock
          stats={[
            { label: "Total applications", value: total },
            { label: "Submitted", value: completed },
            { label: "Incomplete", value: incomplete },
            {
              label: "Completion rate",
              value: total ? `${Math.round((completed / total) * 100)}%` : "—",
            },
          ]}
        />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold text-slate-900">Application mix</h2>
          <p className="mt-1 text-sm text-slate-500">
            Submitted versus incomplete applications.
          </p>
          <div className="mt-4 flex min-h-[240px] items-center justify-center">
            <DonutChart
              className="h-52"
              data={donutData}
              category="value"
              index="name"
              colors={colors}
              showAnimation
            />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold text-slate-900">What this means</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li>
              <span className="font-medium text-slate-900">Submitted</span> —
              applications you have completed and sent.
            </li>
            <li>
              <span className="font-medium text-slate-900">Incomplete</span> —
              drafts still waiting for required information or payment.
            </li>
            <li>
              <span className="font-medium text-slate-900">Completion rate</span>{" "}
              — share of your applications that are fully submitted.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
