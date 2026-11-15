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
import useUser from "@/hooks/useUser";
import useAuth from "@/hooks/useAuth";
import StatsBlock from "@/components/StatsBlock/StatsBlock";

function greetingFor(date: Date) {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const shortcuts = [
  {
    name: "Services",
    detail: "Apply for published company programs and forms",
    href: "/client/services",
    icon: TbDeviceLaptop,
  },
  {
    name: "Financial",
    detail: "Bills, invoices, and payments",
    href: "/client/financial",
    icon: TbCurrencyDollar,
  },
  {
    name: "Apps",
    detail: "Open suite apps and tools",
    href: "/client/apps",
    icon: TbApps,
  },
  {
    name: "Training",
    detail: "Programs and learning resources",
    href: "/client/training",
    icon: TbSchool,
  },
  {
    name: "Analytics",
    detail: "Track applications and progress",
    href: "/client/analytics",
    icon: TbChartBar,
  },
];

export default function ClientDashboardPage() {
  const { user } = useUser();
  const { auth } = useAuth();
  const person = user ?? auth;
  const firstName = person?.firstName ?? person?.first_name;
  const userId = person?.id;

  const { data: formsStats } = useQuery({
    queryKey: ["get forms statistics for user", userId],
    queryFn: services.getFormStatisticsForUser(userId),
    enabled: Boolean(userId),
  });

  const { data: publishedApps = [] } = useQuery({
    queryKey: ["published suite apps dashboard"],
    queryFn: services.listPublishedSuiteApps,
    staleTime: 60_000,
  });

  const appsCount = publishedApps.length;

  return (
    <div className="px-5 py-6 pb-16 sm:px-8">
      <p className="text-sm font-medium text-slate-500">Client portal</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
        {`${greetingFor(new Date())}${firstName ? `, ${firstName}` : ""}`}
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-500">
        Browse services, open apps, and track your applications from one place.
      </p>

      <div className="mt-6">
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
            {
              label: "Published apps",
              value: appsCount,
            },
          ]}
        />
      </div>

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
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-white">
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
