import React from "react";
import AppCard from "./components/AppCard";

function Apps() {
  const lauchApp = async () => {
    "use server";
    console.log("Launching App...");
  };
  const data = [
    {
      name: "Core Apps",
      apps: [
        {
          name: "Mesh Form Builder",
          description: "Create, tailor and assign forms to companies ",
          fill: "#16A34A",
          launchFn: lauchApp,
        },
        {
          name: "Account Pro",
          description: "Create, tailor and assign forms to companies ",
          fill: "#2563EB",
          launchFn: lauchApp,
        },
        {
          name: "Account Pro",
          description: "Create, tailor and assign forms to companies ",
          fill: "#F59E0B",
          launchFn: lauchApp,
        },
      ],
    },
    {
      name: "Third-Party Apps",
      apps: [
        {
          name: "Account Pro",
          description: "Create, tailor and assign forms to companies ",
          fill: "#F59E0B",
          launchFn: lauchApp,
        },
        {
          name: "Mesh Form Builder",
          description: "Create, tailor and assign forms to companies ",
          fill: "#16A34A",
          launchFn: lauchApp,
        },
      ],
    },
  ];
  return (
    <div className="px-5 pb-20 my-4 py-2">
      <div className="text-slate-900 font-semibold text-xl mb-5">
        Applications
      </div>

      <div className="text-slate-900 text-[18px] font-semibold border-b-2 border-[#E2E8F0] w-full pb-2 mb-4">
        Core Apps
      </div>
      <div className="flex gap-5 flex-wrap mb-10">
        {data[0].apps.map((item: any) => (
          <AppCard
            appTitle={item.name}
            appDescription={item.description}
            fill={item.fill}
            launchFn={item.launchFn}
          />
        ))}
      </div>
      <div className="text-slate-900 text-[18px] font-semibold border-b-2 border-[#E2E8F0] w-full pb-2 mb-4">
        Third-Party Apps
      </div>
      <div className="flex gap-5 flex-wrap mb-10">
        {data[1].apps.map((item: any) => (
          <AppCard
            appTitle={item.name}
            appDescription={item.description}
            fill={item.fill}
            launchFn={item.launchFn}
          />
        ))}
      </div>
    </div>
  );
}

export default Apps;
