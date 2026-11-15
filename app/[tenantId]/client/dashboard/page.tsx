"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  TbApps,
  TbChartBar,
  TbCurrencyDollar,
  TbDeviceLaptop,
  TbSchool,
} from "react-icons/tb";
import services from "@/services";
import useCompany from "@/hooks/useCompany";
import useUser from "@/hooks/useUser";
import StatsBlock from "@/components/StatsBlock/StatsBlock";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import UncompletedCard from "../(dashboard)/components/UncompletedCard";

export default function ClientDashboardPage() {
  const { companyBranding: company } = useCompany();
  const { user } = useUser();
  const tenant = company?.company_identifier;
  const brand = company?.color || "#1FA35C";

  const { data: formsStats, isLoading: areStatsLoading } = useQuery({
    queryKey: ["get forms statistics for user", user?.id],
    queryFn: services.getFormStatisticsForUser(user?.id),
    enabled: Boolean(user?.id),
  });

  const { data: uncompletedFormResponses, isLoading: uncompletedLoading } =
    useQuery({
      queryKey: ["user uncompleted forms", user?.id],
      queryFn: services.getUserUncompletedForms(user?.id),
      enabled: Boolean(user?.id),
    });

  const firstName =
    user?.first_name || user?.firstName || user?.email || "there";

  const shortcuts = [
    {
      name: "Services",
      detail: "Apply for company programs and forms",
      href: `/${tenant}/client/services`,
      icon: TbDeviceLaptop,
    },
    {
      name: "Financial",
      detail: "Bills, invoices, and payments",
      href: `/${tenant}/client/financial`,
      icon: TbCurrencyDollar,
    },
    {
      name: "Apps",
      detail: "Open tools linked to your portal",
      href: `/${tenant}/client/apps`,
      icon: TbApps,
    },
    {
      name: "Training",
      detail: "Programs and learning resources",
      href: `/${tenant}/client/training`,
      icon: TbSchool,
    },
    {
      name: "Analytics",
      detail: "Track your applications and progress",
      href: `/${tenant}/client/analytics`,
      icon: TbChartBar,
    },
  ];

  if (areStatsLoading || uncompletedLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingIcon />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-5 pb-20 pt-5">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Welcome back, {firstName}. Here&apos;s your workspace at{" "}
          {company?.name || "this company"}.
        </p>
      </div>

      {uncompletedFormResponses?.length >= 1 && (
        <div className="mb-6 flex flex-col items-center gap-3">
          <UncompletedCard form={uncompletedFormResponses[0]} />
          {uncompletedFormResponses.length > 1 && (
            <Link
              href={`/${tenant}/client/services`}
              className="text-sm font-medium"
              style={{ color: brand }}
            >
              View {uncompletedFormResponses.length - 1} more incomplete
              application
              {uncompletedFormResponses.length > 2 ? "s" : ""}
            </Link>
          )}
        </div>
      )}

      <StatsBlock
        stats={[
          {
            label: "Submitted applications",
            value: formsStats?.completedForms ?? 0,
          },
          {
            label: "Incomplete applications",
            value: formsStats?.uncompletedForms ?? 0,
          },
        ]}
      />

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Quick access
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {shortcuts.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm"
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-white"
                  style={{ backgroundColor: brand }}
                >
                  <Icon size={20} />
                </div>
                <p className="mt-4 font-semibold text-slate-900">{item.name}</p>
                <p className="mt-1 text-sm text-slate-500">{item.detail}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
