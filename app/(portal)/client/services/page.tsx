"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { FiArrowUpRight } from "react-icons/fi";
import { IoLaptopOutline } from "react-icons/io5";
import services from "@/services";
import useUser from "@/hooks/useUser";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import StatsBlock from "@/components/StatsBlock/StatsBlock";

function formList(payload: any) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;
  return [];
}

function formHref(form: any) {
  const url = String(form?.url ?? "").trim();
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("/")
  ) {
    return url;
  }
  return `/f/${form.id}`;
}

export default function ClientServicesPage() {
  const { user } = useUser();
  const userId = user?.id;

  const { data: formsStats, isLoading: statsLoading } = useQuery({
    queryKey: ["get forms statistics for user", userId],
    queryFn: services.getFormStatisticsForUser(userId),
    enabled: Boolean(userId),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["client portal published services"],
    queryFn: services.allForms(0, 50, "ALL"),
  });

  const published = useMemo(() => {
    return formList(data).filter(
      (form: any) =>
        String(form?.publishStatus ?? "").toUpperCase() === "PUBLISHED"
    );
  }, [data]);

  if (isLoading || statsLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <LoadingIcon />
      </div>
    );
  }

  return (
    <div className="px-5 py-6 pb-16 sm:px-8">
      <h1 className="text-xl font-semibold text-slate-900">Services</h1>
      <p className="mt-1 max-w-2xl text-sm text-slate-500">
        Company programs and forms published for customers to apply for.
      </p>

      <div className="mt-6">
        <StatsBlock
          stats={[
            {
              label: "Available services",
              value: published.length,
            },
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
      </div>

      <div className="mt-8">
        {published.length === 0 ? (
          <div className="flex min-h-[20vh] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <IoLaptopOutline size={48} className="text-slate-400" />
            <p className="mt-3 text-lg font-semibold text-slate-900">
              No available services
            </p>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              When companies publish forms, they will appear here for you to
              apply.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {published.map((form: any) => (
              <Link
                key={form.id}
                href={formHref(form)}
                className="group flex min-h-[200px] flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-sm"
              >
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-sm font-semibold text-white">
                    {String(form.name || "S")
                      .trim()
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <p className="mt-4 text-lg font-semibold text-slate-900">
                    {form.name || "Untitled service"}
                  </p>
                  <p className="mt-1 line-clamp-3 text-sm leading-6 text-slate-500">
                    {form.description ||
                      "Open this service to start or continue an application."}
                  </p>
                </div>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
                  Apply
                  <FiArrowUpRight className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
