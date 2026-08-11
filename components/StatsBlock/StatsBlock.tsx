import React from "react";
import KpiCard from "@/components/Dashboard/KpiCard";

interface IStat {
  label: string;
  value: string | number | null | undefined;
  isLoading?: boolean;
}

type Props = {
  stats: IStat[];
};

function displayValue(value: IStat["value"]) {
  if (value == null || value === "") return "0";
  return value;
}

function iconGlyph(value: IStat["value"]) {
  const text = String(displayValue(value));
  if (text === "undefined" || text === "null" || text === "NaN") return "0";
  return text.slice(0, 1) || "0";
}

const StatsBlock: React.FC<Props> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 gap-2.5 [&>*:last-child:nth-child(odd)]:col-span-2 sm:gap-4 sm:[&>*:last-child:nth-child(odd)]:col-span-1 xl:grid-cols-4">
      {stats.map((stat, index) => (
        <KpiCard
          key={`${stat.label}-${index}`}
          label={stat.label}
          value={displayValue(stat.value)}
          isLoading={stat.isLoading}
          icon={
            <span className="text-sm font-semibold text-brand-600">
              {iconGlyph(stat.value)}
            </span>
          }
        />
      ))}
    </div>
  );
};

export default StatsBlock;
