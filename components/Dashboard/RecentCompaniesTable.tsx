"use client";

import Link from "next/link";
import { Spinner } from "@heroui/react";
import DashboardPanel from "./DashboardPanel";
import { FormatDateShort } from "@/utils/FormatDate/FormatDate";

type CompanyRow = {
  id?: string | number;
  companyName?: string;
  primaryContactEmail?: string;
  status?: string;
  createdOn?: string;
};

type Props = {
  companies: CompanyRow[];
  isLoading?: boolean;
  viewAllHref?: string;
};

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700",
  INACTIVE: "bg-slate-100 text-slate-600",
  SUSPENDED: "bg-amber-100 text-amber-700",
};

export default function RecentCompaniesTable({
  companies,
  isLoading,
  viewAllHref,
}: Props) {
  return (
    <DashboardPanel
      title="Recent Companies"
      action={
        viewAllHref ? (
          <Link
            href={viewAllHref}
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            View all
          </Link>
        ) : undefined
      }
    >
      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Spinner color="primary" />
        </div>
      ) : companies.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">
          No companies found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
                <th className="pb-3 pr-4 font-medium">Company</th>
                <th className="pb-3 pr-4 font-medium">Email</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company, index) => (
                <tr
                  key={`company-${company.id ?? "row"}-${index}`}
                  className="border-b border-slate-50 last:border-0"
                >
                  <td className="py-3 pr-4 font-medium text-slate-900">
                    {company.companyName ?? "—"}
                  </td>
                  <td className="py-3 pr-4 text-slate-600">
                    {company.primaryContactEmail ?? "—"}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        statusStyles[company.status ?? ""] ??
                        "bg-brand-50 text-brand-700"
                      }`}
                    >
                      {company.status ?? "—"}
                    </span>
                  </td>
                  <td className="py-3 text-slate-500">
                    {company.createdOn
                      ? FormatDateShort(company.createdOn)
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardPanel>
  );
}
