"use client";

import Link from "next/link";
import { Spinner } from "@heroui/react";
import { FiExternalLink, FiMail, FiPhone } from "react-icons/fi";
import CompanyBrandAvatar from "@/components/CompanyBrand/CompanyBrandAvatar";
import { FormatDateShort } from "@/utils/FormatDate/FormatDate";

export type CompanyRow = {
  id?: string | number;
  companyName?: string;
  companyLogo?: string;
  brandingLogo?: string;
  primaryContactEmail?: string;
  primaryContactPhoneNumber?: string;
  status?: string;
  createdOn?: string;
  industry?: string;
};

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  INACTIVE: "bg-slate-100 text-slate-600 ring-slate-500/10",
  SUSPENDED: "bg-amber-50 text-amber-700 ring-amber-600/20",
};

function companyBrandLogo(company: CompanyRow) {
  return company.brandingLogo ?? company.companyLogo;
}

function StatusBadge({ status }: { status?: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ring-inset sm:text-xs ${
        statusStyles[status ?? ""] ??
        "bg-brand-50 text-brand-700 ring-brand-600/20"
      }`}
    >
      {status ?? "—"}
    </span>
  );
}

type Props = {
  companies: CompanyRow[];
  isLoading?: boolean;
  profileBasePath?: string;
};

export default function CompaniesTable({
  companies,
  isLoading,
  profileBasePath = "/company-setup/profile",
}: Props) {
  if (isLoading) {
    return (
      <div className="flex h-56 items-center justify-center">
        <Spinner color="primary" />
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <FiExternalLink size={22} />
        </div>
        <p className="text-base font-medium text-slate-900">No companies found</p>
        <p className="mt-1 max-w-sm text-sm text-slate-500">
          Try adjusting your search or filters, or create a new company to get
          started.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile card list */}
      <div className="space-y-2.5 md:hidden">
        {companies.map((company, index) => (
          <Link
            key={`company-card-${company.id ?? "row"}-${index}`}
            href={`${profileBasePath}?id=${company.id}`}
            className="block rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-colors active:bg-brand-50/50"
          >
            <div className="flex items-start gap-3">
              <CompanyBrandAvatar
                logoUrl={companyBrandLogo(company)}
                name={company.companyName}
                size="sm"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {company.companyName ?? "—"}
                    </p>
                    <p className="mt-0.5 text-[10px] text-slate-400">
                      ID #{company.id ?? "—"}
                    </p>
                  </div>
                  <StatusBadge status={company.status} />
                </div>

                <div className="mt-2.5 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                    <FiMail className="shrink-0 text-slate-400" size={12} />
                    <span className="truncate">
                      {company.primaryContactEmail ?? "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-1.5 text-[11px] text-slate-600">
                      <FiPhone className="shrink-0 text-slate-400" size={12} />
                      <span className="truncate">
                        {company.primaryContactPhoneNumber ?? "—"}
                      </span>
                    </div>
                    <span className="shrink-0 text-[10px] text-slate-400">
                      {company.createdOn
                        ? FormatDateShort(company.createdOn)
                        : "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Company
              </th>
              <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Contact
              </th>
              <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Phone
              </th>
              <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>
              <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Added
              </th>
              <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {companies.map((company, index) => (
              <tr
                key={`company-${company.id ?? "row"}-${index}`}
                className="group transition-colors hover:bg-brand-50/40"
              >
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-3">
                    <CompanyBrandAvatar
                      logoUrl={companyBrandLogo(company)}
                      name={company.companyName}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">
                        {company.companyName ?? "—"}
                      </p>
                      <p className="text-xs text-slate-400">
                        ID #{company.id ?? "—"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4 pr-4">
                  <div className="flex max-w-[220px] items-center gap-2 text-slate-600">
                    <FiMail className="shrink-0 text-slate-400" size={14} />
                    <span className="truncate">
                      {company.primaryContactEmail ?? "—"}
                    </span>
                  </div>
                </td>
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-2 whitespace-nowrap text-slate-600">
                    <FiPhone className="shrink-0 text-slate-400" size={14} />
                    <span>{company.primaryContactPhoneNumber ?? "—"}</span>
                  </div>
                </td>
                <td className="py-4 pr-4">
                  <StatusBadge status={company.status} />
                </td>
                <td className="py-4 pr-4 whitespace-nowrap text-slate-500">
                  {company.createdOn
                    ? FormatDateShort(company.createdOn)
                    : "—"}
                </td>
                <td className="py-4 text-right">
                  <Link
                    href={`${profileBasePath}?id=${company.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-all hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                  >
                    View
                    <FiExternalLink size={12} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
