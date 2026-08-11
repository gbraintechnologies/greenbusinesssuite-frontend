"use client";

import Link from "next/link";
import { Spinner } from "@heroui/react";
import { FiExternalLink, FiMail, FiPhone } from "react-icons/fi";
import CompanyBrandAvatar from "@/components/CompanyBrand/CompanyBrandAvatar";
import { isPersistableLogoUrl } from "@/hooks/useFileUpload";
import { FormatDateShort } from "@/utils/FormatDate/FormatDate";

export type CompanyRow = {
  id?: string | number;
  companyName?: string;
  company_name?: string;
  companyLogo?: string;
  company_logo?: string;
  brandingLogo?: string;
  branding_logo?: string;
  logo?: string;
  primaryContactEmail?: string;
  primary_contact_email?: string;
  primaryContactPhoneNumber?: string;
  primary_contact_phone_number?: string;
  status?: string;
  createdOn?: string;
  created_on?: string;
  industry?: string;
};

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  INACTIVE: "bg-slate-100 text-slate-600 ring-slate-500/10",
  SUSPENDED: "bg-amber-50 text-amber-700 ring-amber-600/20",
};

function companyBrandLogo(company: CompanyRow) {
  const candidates = [
    company.brandingLogo,
    company.branding_logo,
    company.companyLogo,
    company.company_logo,
    company.logo,
  ];

  return candidates.find((value) => isPersistableLogoUrl(value)) ?? null;
}

function companyDisplayName(company: CompanyRow) {
  return company.companyName ?? company.company_name;
}

function companyEmail(company: CompanyRow) {
  return company.primaryContactEmail ?? company.primary_contact_email;
}

function companyPhone(company: CompanyRow) {
  return (
    company.primaryContactPhoneNumber ?? company.primary_contact_phone_number
  );
}

function companyCreatedOn(company: CompanyRow) {
  return company.createdOn ?? company.created_on;
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
                name={companyDisplayName(company)}
                size="sm"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {companyDisplayName(company) ?? "—"}
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
                      {companyEmail(company) ?? "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-1.5 text-[11px] text-slate-600">
                      <FiPhone className="shrink-0 text-slate-400" size={12} />
                      <span className="truncate">
                        {companyPhone(company) ?? "—"}
                      </span>
                    </div>
                    <span className="shrink-0 text-[10px] text-slate-400">
                      {companyCreatedOn(company)
                        ? FormatDateShort(companyCreatedOn(company)!)
                        : "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop table — fits container width, no horizontal scroll */}
      <div className="hidden w-full min-w-0 md:block">
        <table className="w-full table-fixed text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="w-[28%] pb-3 pr-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Company
              </th>
              <th className="w-[24%] pb-3 pr-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Contact
              </th>
              <th className="w-[16%] pb-3 pr-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Phone
              </th>
              <th className="w-[12%] pb-3 pr-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>
              <th className="w-[10%] pb-3 pr-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Added
              </th>
              <th className="w-[10%] pb-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
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
                <td className="py-4 pr-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <CompanyBrandAvatar
                      logoUrl={companyBrandLogo(company)}
                      name={companyDisplayName(company)}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-slate-900">
                        {companyDisplayName(company) ?? "—"}
                      </p>
                      <p className="truncate text-xs text-slate-400">
                        ID #{company.id ?? "—"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4 pr-3">
                  <div className="flex min-w-0 items-center gap-2 text-slate-600">
                    <FiMail className="shrink-0 text-slate-400" size={14} />
                    <span
                      className="truncate"
                      title={companyEmail(company) ?? undefined}
                    >
                      {companyEmail(company) ?? "—"}
                    </span>
                  </div>
                </td>
                <td className="py-4 pr-3">
                  <div className="flex min-w-0 items-center gap-2 text-slate-600">
                    <FiPhone className="shrink-0 text-slate-400" size={14} />
                    <span
                      className="truncate"
                      title={companyPhone(company) ?? undefined}
                    >
                      {companyPhone(company) ?? "—"}
                    </span>
                  </div>
                </td>
                <td className="py-4 pr-3">
                  <StatusBadge status={company.status} />
                </td>
                <td className="py-4 pr-3 text-slate-500">
                  <span className="block truncate">
                    {companyCreatedOn(company)
                      ? FormatDateShort(companyCreatedOn(company)!)
                      : "—"}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <Link
                    href={`${profileBasePath}?id=${company.id}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-all hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                  >
                    View
                    <FiExternalLink size={12} className="shrink-0" />
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
