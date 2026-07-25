"use client";

import React from "react";

import StatsBlock from "@/components/StatsBlock/StatsBlock";

import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import useCompany from "@/hooks/useCompany";
import SuspendedNotice from "../components/SuspendedNotice";
import Analytics from "../components/Analytics/Analytics";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import KpiCard from "@/components/Dashboard/KpiCard";
import RevenueChart from "@/components/Dashboard/RevenueChart";
import FormPipelineChart from "@/components/Dashboard/FormPipelineChart";
import RecentPaymentsTable from "@/components/Dashboard/RecentPaymentsTable";
import {
  computeAveragePayment,
  computeCompletionRate,
  formatCurrency,
  formatNumber,
  formatPercent,
} from "@/utils/dashboard/formatters";
import { aggregatePaymentsByMonth } from "@/utils/dashboard/paymentChartData";
import {
  FiBriefcase,
  FiDollarSign,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";

function CompanyDashboard() {
  const { companyBranding: company, companyAdmin } = useCompany();

  const [adminStatus, setAdminStatus] = React.useState("");

  const { data: uniqueUsersCount, isLoading: usersLoading } = useQuery({
    queryKey: ["unique users count", company?.id],
    queryFn: services.uniqueUsersCount(company?.id),
    enabled: !!company?.id,
  });

  const { data: totalEntries, isLoading: entriesLoading } = useQuery({
    queryKey: ["total entries per company", company?.id],
    queryFn: services.totalEntries(company?.id),
    enabled: !!company?.id,
  });

  const { data: formStats, isLoading: formStatsLoading } = useQuery({
    queryKey: ["form stats completed/incomplete", company?.id],
    queryFn: services.companyFormStats(company?.id),
    enabled: !!company?.id,
  });

  const { data: publishedFormsIds } = useQuery({
    queryKey: ["published forms ids", company?.id],
    queryFn: services.publishedFomsOfCompany(company?.id),
    enabled: !!company?.id,
  });

  const { data: linksOpened, isLoading: linksOpenedLoading } = useQuery({
    queryKey: [
      "links opened per company",
      company?.id,
      publishedFormsIds?.join(","),
    ],
    queryFn: services.linksOpened(company?.id, publishedFormsIds?.join(",")),
    enabled: !!company?.id && !!publishedFormsIds?.length,
  });

  const { data: linksIgnored, isLoading: linksIgnoredLoading } = useQuery({
    queryKey: [
      "ignored links per company",
      company?.id,
      publishedFormsIds?.join(","),
    ],
    queryFn: services.ignoredLinks(company?.id, publishedFormsIds?.join(",")),
    enabled: !!company?.id && !!publishedFormsIds?.length,
  });

  const { data: revenue, isLoading: revenueLoading } = useQuery({
    queryKey: ["Payments Summary"],
    queryFn: services.getPaymentSummary(),
  });

  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ["dashboard recent payments"],
    queryFn: services.getAllPayments(0, 50, "ALL"),
  });

  React.useEffect(() => {
    setAdminStatus(companyAdmin?.user_status);
  }, [companyAdmin]);

  const completionRate = computeCompletionRate(
    formStats?.completedForms,
    totalEntries
  );

  const averagePayment = computeAveragePayment(
    Number(revenue ?? 0),
    formStats?.completedForms
  );

  const revenueChartData = aggregatePaymentsByMonth(payments?.content ?? []);

  const pipelineData = [
    { name: "Total Entries", value: Number(totalEntries ?? 0) },
    { name: "Links Opened", value: Number(linksOpened ?? 0) },
    { name: "Completed Submissions", value: Number(formStats?.completedForms ?? 0) },
    { name: "Incomplete Submissions", value: Number(formStats?.uncompletedForms ?? 0) },
    { name: "Ignored Links", value: Number(linksIgnored ?? 0) },
  ].filter((item) => item.value > 0);

  const pipelineLoading =
    entriesLoading ||
    formStatsLoading ||
    linksOpenedLoading ||
    linksIgnoredLoading;

  return (
    <div className="bg-surface-muted min-h-screen px-5 pb-20 pt-5">
      <DashboardHeader
        title="Dashboard"
        subtitle="Overview of your business performance"
      />

      {adminStatus == "INACTIVE" && (
        <div className="mb-6">
          <SuspendedNotice />
        </div>
      )}

      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 xl:grid-cols-4">
        <KpiCard
          label="Revenue"
          value={formatCurrency(revenue)}
          isLoading={revenueLoading}
          icon={<FiDollarSign size={18} />}
        />
        <KpiCard
          label="Completed Applications"
          value={formatNumber(formStats?.completedForms)}
          isLoading={formStatsLoading}
          icon={<FiBriefcase size={18} />}
        />
        <KpiCard
          label="Completion Rate"
          value={formatPercent(completionRate)}
          isLoading={entriesLoading || formStatsLoading}
          icon={<FiTrendingUp size={18} />}
        />
        <KpiCard
          label="Active Users"
          value={formatNumber(uniqueUsersCount)}
          isLoading={usersLoading}
          icon={<FiUsers size={18} />}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <RevenueChart data={revenueChartData} isLoading={paymentsLoading} />
        <FormPipelineChart
          data={pipelineData.length > 0 ? pipelineData : [{ name: "No data yet", value: 0 }]}
          isLoading={pipelineLoading}
        />
      </div>

      <div className="mt-6">
        <RecentPaymentsTable
          payments={(payments?.content ?? []).slice(0, 5)}
          isLoading={paymentsLoading}
          viewAllHref={
            company?.companyIdentifier
              ? `/${company.companyIdentifier}/admin/payments`
              : undefined
          }
        />
      </div>

      <div className="mt-6">
        <StatsBlock
          stats={[
            {
              label: "Total Registrations",
              value: totalEntries ?? "—",
            },
            {
              label: "Average Payment",
              value: averagePayment ? formatCurrency(averagePayment) : "—",
            },
            {
              label: "Incomplete Submissions",
              value: formStats?.uncompletedForms ?? "—",
            },
            {
              label: "Links Opened",
              value: linksOpened ?? "—",
            },
          ]}
        />
      </div>

      <div className="mt-6">
        <Analytics />
      </div>
    </div>
  );
}

export default CompanyDashboard;
