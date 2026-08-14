"use client";

import type { ProgramOption } from "../_data/mockAnalytics";

type Props = {
  label: string;
  options: ProgramOption[];
  value: string;
  onChange: (value: string) => void;
};

export default function AnalyticsFilter({
  label,
  options,
  value,
  onChange,
}: Props) {
  return (
    <label className="flex min-w-[14rem] flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
