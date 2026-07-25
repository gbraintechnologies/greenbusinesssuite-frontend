import React from "react";
import { Spinner } from "@heroui/react";

type Props = {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  isLoading?: boolean;
  trend?: {
    value: string;
    direction: "up" | "down" | "neutral";
  };
};

export default function KpiCard({
  label,
  value,
  icon,
  isLoading = false,
  trend,
}: Props) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-5">
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 sm:h-10 sm:w-10 sm:rounded-xl">
          {icon}
        </div>
        {trend && (
          <span
            className={`truncate text-[10px] font-medium sm:text-xs ${
              trend.direction === "up"
                ? "text-emerald-600"
                : trend.direction === "down"
                  ? "text-red-500"
                  : "text-slate-500"
            }`}
          >
            {trend.direction === "up" && "↑ "}
            {trend.direction === "down" && "↓ "}
            {trend.value}
          </span>
        )}
      </div>
      <p className="mt-3 truncate text-[10px] font-medium uppercase tracking-wide text-slate-500 sm:mt-4 sm:text-xs">
        {label}
      </p>
      <div className="mt-1 text-xl font-semibold leading-tight text-slate-900 sm:text-2xl">
        {isLoading ? <Spinner size="sm" color="primary" /> : value}
      </div>
    </div>
  );
}
