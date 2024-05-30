import React from "react";

type Props = {
  header: string;
  value: string | number;
};
const DashboardCard: React.FC<Props> = ({ header, value }) => {
  return (
    <div className="bg-[#F1F5F9] border border-[#E2E8F0] w-[31.3%] flex flex-col py-4 px-4 gap-4 rounded-md">
      <div className="text-[#334155] font-bold text-[12px]  tracking-[.02em]">
        {header}
      </div>
      <div className="font-semibold text-3xl text-slate-900">{value}</div>
    </div>
  );
};

export default DashboardCard;
