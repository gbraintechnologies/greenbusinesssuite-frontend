"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { FiExternalLink } from "react-icons/fi";
import services from "@/services";
import type { SuiteProduct } from "@/lib/suiteProducts";

export default function CompanyAdminAppsPage() {
  const { data: apps = [], isLoading } = useQuery({
    queryKey: ["published suite apps company admin"],
    queryFn: services.listPublishedSuiteApps,
    staleTime: 60_000,
  });

  return (
    <div className="px-3 pb-10 sm:px-5">
      <div className="mb-6">
        <h3 className="text-xl font-semibold sm:text-2xl">Apps</h3>
        <p className="mt-1 text-sm text-slate-500">
          Suite apps published by the platform. They appear on your marketing
          page and for BusinessSuite clients.
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Loading apps…</p>
      ) : apps.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
          No published apps yet. Platform admins publish apps from the Apps
          section.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {apps.map((app: SuiteProduct) => {
            const external =
              app.href?.startsWith("http://") ||
              app.href?.startsWith("https://");
            return (
              <a
                key={app.id}
                href={app.href || "#"}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 transition hover:border-brand-300 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  {app.logoUrl ? (
                    <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-slate-100 bg-white">
                      <Image
                        src={app.logoUrl}
                        alt=""
                        fill
                        className="object-contain p-1.5"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg font-semibold text-white ${app.accent || "bg-brand-600"}`}
                    >
                      {app.mark || app.name?.charAt(0) || "A"}
                    </div>
                  )}
                  <FiExternalLink className="text-slate-400 transition group-hover:text-brand-600" />
                </div>
                <p className="mt-4 text-base font-semibold text-slate-900">
                  {app.name}
                </p>
                {app.tagline && (
                  <p className="mt-1 text-sm font-medium text-brand-700">
                    {app.tagline}
                  </p>
                )}
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                  {app.description}
                </p>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
