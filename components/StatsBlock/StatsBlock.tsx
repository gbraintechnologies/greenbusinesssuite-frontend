import React from "react";
import KpiCard from "@/components/Dashboard/KpiCard";

interface IStat {
  label: string;
  value: string | number;
}

type Props = {
  stats: IStat[];
};

const StatsBlock: React.FC<Props> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 gap-2.5 [&>*:last-child:nth-child(odd)]:col-span-2 sm:gap-4 sm:[&>*:last-child:nth-child(odd)]:col-span-1 xl:grid-cols-4">
      {stats.map((stat, index) => (
        <KpiCard
          key={`${stat.label}-${index}`}
          label={stat.label}
          value={stat.value}
          icon={
            <span className="text-sm font-semibold text-brand-600">
              {String(stat.value).slice(0, 1) || "—"}
            </span>
          }
        />
      ))}
    </div>
  );
};

export default StatsBlock;
