import React from "react";

interface IStat {
  label: string;
  value: string;
}
type Props = {
  stats: IStat[];
};
const StatsBlock: React.FC<Props> = ({ stats }) => {
  return (
    <div className="bg-white flex justify-between py-3 rounded-lg border border-[#E2E8F0]">
      {stats.map((stat, index) => (
        <div className={`flex flex-col gap-4 flex-1 pl-4 ${index !== 0 && " border-l border-[#E2E8F0]"}`} key={index}>
          <div className="text-[#475569] text-sm">{stat.label}</div>
          <div className="text-[#0F172A] font-semibold text-[22px]">
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsBlock;
