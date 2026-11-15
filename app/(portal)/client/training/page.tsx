"use client";

import Link from "next/link";
import { TbCertificate, TbPlayerPlay, TbSchool } from "react-icons/tb";

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
    detail: "Collect completion records from your programs.",
    icon: TbCertificate,
  },
];

export default function ClientTrainingPage() {
  return (
    <div className="px-5 py-6 pb-16 sm:px-8">
      <h1 className="text-xl font-semibold text-slate-900">Training</h1>
      <p className="mt-1 max-w-2xl text-sm text-slate-500">
        Learning programs and resources available to you as a customer.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {tracks.map((track) => {
          const Icon = track.icon;
          return (
            <div
              key={track.title}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-white">
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
          When training programs are published, they will appear here for
          enrollment and progress tracking.
        </p>
        <Link
          href="/client/services"
          className="mt-5 inline-flex text-sm font-semibold text-brand-700"
        >
          Browse related services
        </Link>
      </div>
    </div>
  );
}
