import React from "react";

import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import useCompany from "@/hooks/useCompany";
import AnalyticsGrid from "../../components/Analytics/AnalyticsGrid";

function Analytics({ formID }: { formID: number }) {
  const { company } = useCompany();

  const { data, isLoading } = useQuery({
    queryKey: ["form analytics", formID, company],
    queryFn: services.formResponseAnalytics(
      Number(formID),
      company?.company_name
    ),
    enabled: Boolean(Boolean(formID) && Boolean(company?.company_name)),
  });

  return (
    <div className="pb-40">
      <div className="mt-4 border border-[#E2E8F0] bg-white  rounded-lg  py-3">
        <div className="flex justify-between items-center border-b px-5 border-[#E2E8F0] pb-4 mb-5">
          <div className="font-semibold ">Response Insights</div>
        </div>

        {isLoading && (
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

        {data && <AnalyticsGrid analytics={data} />}
      </div>
    </div>
  );
}

export default Analytics;
