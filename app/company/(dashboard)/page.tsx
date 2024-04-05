import React from "react";
import DashboardCard from "./components/DashboardCard";

function CompanyDashboard() {
  const data = [
    { header: "Number Of Registrations", value: 200 },
    { header: "Number Of Submitted Applications", value: "7.2k" },
    { header: "Number Of Active Users", value: "7.2k" },
  ];
  return (
    <div className="px-5">
      <div className="text-slate-900 font-semibold text-xl mb-5">Dashboard</div>
      <div className="flex gap-5 flex-wrap">
        {data.map((item: any) => (
          <DashboardCard header={item.header} value={item.value} />
        ))}
      </div>
    </div>
  );
}

export default CompanyDashboard;
