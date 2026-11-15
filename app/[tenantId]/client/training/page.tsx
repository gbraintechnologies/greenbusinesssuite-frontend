"use client";

import Link from "next/link";
import { TbSchool, TbPlayerPlay, TbCertificate } from "react-icons/tb";
import useCompany from "@/hooks/useCompany";
import { AvailableModules } from "@/config/modules";

export default function ClientTrainingPage() {
  const { companyBranding: company } = useCompany();
  const brand = company?.color || "#1FA35C";
  const tenant = company?.company_identifier;
  const hasMedia = company?.companyModules?.includes(
    AvailableModules.MediaCenter
  );

  const tracks = [
    {
      title: "Programs",
      detail: "Browse training programs published for customers.",
      icon: TbSchool,
    },
    {
      title: "Sessions",
      detail: "Join upcoming sessions and continue in-progress learning.",
      icon: TbPlayerPlay,
    },
    {
      title: "Certificates",
      detail: "Collect completion records issued by the company.",
      icon: TbCertificate,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-5 pb-20 pt-5">
      <h1 className="text-xl font-semibold text-slate-900">Training</h1>
      <p className="mt-1 max-w-2xl text-sm text-slate-500">
        Learning programs and resources offered by{" "}
        {company?.name || "this company"}.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {tracks.map((track) => {
          const Icon = track.icon;
          return (
            <div
              key={track.title}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg text-white"
                style={{ backgroundColor: brand }}
              >
                <Icon size={20} />
              </div>
              <p className="mt-4 font-semibold text-slate-900">{track.title}</p>
              <p className="mt-1 text-sm text-slate-500">{track.detail}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
        <p className="font-semibold text-slate-900">
          Training catalog is being prepared
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          When {company?.name || "the company"} publishes training programs,
          they will appear here for enrollment and progress tracking.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={`/${tenant}/client/services`}
            className="text-sm font-semibold"
            style={{ color: brand }}
          >
            Browse related services
          </Link>
          {hasMedia && (
            <Link
              href={`/${tenant}/client/home`}
              className="text-sm font-semibold text-slate-600"
            >
              Open media home
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
