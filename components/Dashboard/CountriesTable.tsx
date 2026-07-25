"use client";

import Link from "next/link";
import { Spinner } from "@heroui/react";
import { FiEdit2, FiGlobe, FiMapPin, FiTrash2 } from "react-icons/fi";
import { Countrie } from "@/app/(admin)/(pages)/country-setup/components/Countries";

export type CountryRow = {
  id: number;
  name: string;
  parentLevels?: number;
  childLevels?: number;
};

type Props = {
  countries: CountryRow[];
  isLoading?: boolean;
  onDelete?: (id: number) => void;
  canEdit?: boolean;
  canDelete?: boolean;
};

function CountryFlag({ name }: { name: string }) {
  const country = Countrie(name);
  const flagUrl = country?.flags?.png;

  if (flagUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={flagUrl}
        alt={`${name} flag`}
        className="h-7 w-10 rounded object-cover shadow-sm ring-1 ring-slate-200"
      />
    );
  }

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-semibold text-white shadow-sm">
      {name?.slice(0, 2)?.toUpperCase() || "??"}
    </div>
  );
}

export default function CountriesTable({
  countries,
  isLoading,
  onDelete,
  canEdit = true,
  canDelete = true,
}: Props) {
  if (isLoading) {
    return (
      <div className="flex h-56 items-center justify-center">
        <Spinner color="primary" />
      </div>
    );
  }

  if (countries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <FiGlobe size={22} />
        </div>
        <p className="text-base font-medium text-slate-900">No countries found</p>
        <p className="mt-1 max-w-sm text-sm text-slate-500">
          Try adjusting your search, or add a new country jurisdiction to get
          started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Country
            </th>
            <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Hierarchy
            </th>
            <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
              ID
            </th>
            <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {countries.map((country, index) => (
            <tr
              key={`country-${country.id}-${index}`}
              className="group transition-colors hover:bg-brand-50/40"
            >
              <td className="py-4 pr-4">
                <div className="flex items-center gap-3">
                  <CountryFlag name={country.name} />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">
                      {country.name}
                    </p>
                    <p className="text-xs text-slate-400">Jurisdiction setup</p>
                  </div>
                </div>
              </td>
              <td className="py-4 pr-4">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  <FiMapPin size={12} className="text-brand-600" />
                  {country.parentLevels != null
                    ? `${country.parentLevels} parent level${
                        country.parentLevels === 1 ? "" : "s"
                      }`
                    : "Configured"}
                </div>
              </td>
              <td className="py-4 pr-4 text-slate-500">#{country.id}</td>
              <td className="py-4">
                <div className="flex items-center justify-end gap-2">
                  {canEdit && (
                    <Link
                      href={`/country-setup/edit-jurisdiction?id=${country.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-all hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                    >
                      <FiEdit2 size={13} />
                      Edit
                    </Link>
                  )}
                  {canDelete && onDelete && (
                    <button
                      type="button"
                      onClick={() => onDelete(country.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                      <FiTrash2 size={13} />
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
