import React from "react";
import DashboardCard from "./components/DashboardCard";

function CompanyDashboard() {
  const data = [
    { header: "Number Of Registrations", value: "" },
    { header: "Number Of Submitted Applications", value: "" },
    { header: "Number Of Active Users", value: "" },
  ];
  return (
    <div className="px-5 pb-20 mt-5">
      <div className="text-slate-900 font-semibold text-xl mb-5">Dashboard</div>
      <div className="flex gap-5 flex-wrap">
        {data.map((item: any, index: number) => (
          <DashboardCard header={item.header} value={item.value} key={index} />
        ))}
      </div>
    </div>
  );
}

export default CompanyDashboard;
