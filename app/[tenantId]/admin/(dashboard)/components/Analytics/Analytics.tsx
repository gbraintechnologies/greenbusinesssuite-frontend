import React from "react";

import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import useCompany from "@/hooks/useCompany";
import AnalyticsGrid from "./AnalyticsGrid";

function Analytics() {
  const { companyBranding: company } = useCompany();

  const { data: genderStats, isLoading: genderStatsLoading } = useQuery({
    queryKey: ["business profiles by gender"],
    queryFn: services.getBusinessProfileGenderCount(),
  });

  const { data: sectorStats, isLoading: sectorStatsLoading } = useQuery({
    queryKey: ["business profiles by sector"],
    queryFn: services.getBusinessProfileSectorCount(),
  });

  const { data: businessStats, isLoading: businessStatsLoading } = useQuery({
    queryKey: ["business profiles by type"],
    queryFn: services.getBusinessProfileTypesCount(),
  });

  return (
    <div className="pb-40">
      <div className="mt-4 rounded-2xl border border-slate-200 bg-white pt-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 pb-4">
          <div className="font-semibold text-slate-900">Response Insights</div>
        </div>

        {genderStatsLoading && (
          <div className="grid grid-cols-2 gap-10 p-10">
            <div>
              <div className=" h-4 w-[25%] bg-gray-200 animate-pulse mb-2 rounded-lg"></div>
              <div className=" h-8 w-[75%] bg-gray-200 animate-pulse mb-3 rounded-lg"></div>
              <div className=" h-40 bg-gray-300 animate-pulse w-full rounded-lg"></div>
            </div>
            <div>
              <div className=" h-4 w-[25%] bg-gray-200 animate-pulse mb-2 rounded-lg"></div>
              <div className=" h-8 w-[75%] bg-gray-200 animate-pulse mb-3 rounded-lg"></div>
              <div className=" h-40 bg-gray-300 animate-pulse w-full rounded-lg"></div>
            </div>
            <div>
              <div className=" h-4 w-[25%] bg-gray-200 animate-pulse mb-2 rounded-lg"></div>
              <div className=" h-8 w-[75%] bg-gray-200 animate-pulse mb-3 rounded-lg"></div>
              <div className=" h-40 bg-gray-300 animate-pulse w-full rounded-lg"></div>
            </div>
            <div>
              <div className=" h-4 w-[25%] bg-gray-200 animate-pulse mb-2 rounded-lg"></div>
              <div className=" h-8 w-[75%] bg-gray-200 animate-pulse mb-3 rounded-lg"></div>
              <div className=" h-40 bg-gray-300 animate-pulse w-full rounded-lg"></div>
            </div>
          </div>
        )}

        {(genderStats && sectorStats && businessStats) && (
          <AnalyticsGrid
            genderStats={genderStats}
            sectorStats={sectorStats}
            businessStats={businessStats}
          />
        )}
      </div>
    </div>
  );
}

export default Analytics;
