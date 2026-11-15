"use client";

import Link from "next/link";
import { TbFileInvoice, TbReceipt, TbWallet } from "react-icons/tb";

const areas = [
  {
    title: "Bills",
    detail: "View bills issued to your account and track what is due.",
    icon: TbFileInvoice,
  },
  {
    title: "Invoices",
    detail: "Review invoices tied to your applications and services.",
    icon: TbReceipt,
  },
  {
    title: "Payments",
    detail: "Follow payment status for submitted applications.",
    icon: TbWallet,
  },
];

export default function ClientFinancialPage() {
  return (
    <div className="px-5 py-6 pb-16 sm:px-8">
      <h1 className="text-xl font-semibold text-slate-900">
        Financial services
      </h1>
      <p className="mt-1 max-w-2xl text-sm text-slate-500">
        Bills, invoices, and payments connected to your applications.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {areas.map((area) => {
          const Icon = area.icon;
          return (
            <div
              key={area.title}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-white">
                <Icon size={20} />
              </div>
              <p className="mt-4 font-semibold text-slate-900">{area.title}</p>
              <p className="mt-1 text-sm text-slate-500">{area.detail}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
        <p className="font-semibold text-slate-900">
          Your financial activity will show here
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          When companies issue bills or invoices for your applications, they
          will appear in this section.
        </p>
        <Link
          href="/client/services"
          className="mt-5 inline-flex text-sm font-semibold text-brand-700"
        >
          Browse services
        </Link>
      </div>
    </div>
  );
}
