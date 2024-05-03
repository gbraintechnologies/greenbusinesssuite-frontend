"use client";
import React from "react";
import AppCard from "./components/AppCard";
import { useRouter } from "next/navigation";
import useAdmin from "@/hooks/useAdmin";

function Apps() {
  const router = useRouter();
  const lauchApp = (appSlug: string) => {
    console.log("Launching App...");
    router.push(`/company/apps/${appSlug}`);
  };

  const data = [
    {
      name: "Core Apps",
      apps: [
        {
          name: "Mesh Forms",
          description: "Create, tailor and assign forms to companies ",
          fill: "#16A34A",
          slug: "mesh-forms",
        },
        {
          name: "Account Pro",
          description: "Create, tailor and assign forms to companies ",
          fill: "#2563EB",
          slug: "account-pro",
        },
        {
          name: "Account Pro",
          description: "Create, tailor and assign forms to companies ",
          fill: "#F59E0B",
          slug: "account-pro",
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
          slug: "account-pro",
        },
        {
          name: "Mesh Forms",
          description: "Create, tailor and assign forms to companies ",
          fill: "#16A34A",
          slug: "mesh-forms",
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
        {data[0].apps.map((item: any, index: number) => (
          <AppCard
            key={index}
            appTitle={item.name}
            appDescription={item.description}
            fill={item.fill}
            slug={item.slug}
          />
        ))}
      </div>
      <div className="text-slate-900 text-[18px] font-semibold border-b-2 border-[#E2E8F0] w-full pb-2 mb-4">
        Third-Party Apps
      </div>
      <div className="flex gap-5 flex-wrap mb-10">
        {data[1].apps.map((item: any, index: number) => (
          <AppCard
            key={index}
            appTitle={item.name}
            appDescription={item.description}
            fill={item.fill}
            slug={item.slug}
          />
        ))}
      </div>
    </div>
  );
}

export default Apps;
