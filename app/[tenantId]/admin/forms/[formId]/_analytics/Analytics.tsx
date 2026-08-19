import React from "react";

import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import useCompany from "@/hooks/useCompany";
import AnalyticsGrid from "../../components/Analytics/AnalyticsGrid";

function statisticalFields(form: any) {
  return (form?.formSections ?? []).flatMap((section: any) =>
    (section?.formFields ?? []).filter(
      (field: any) =>
        !field?.isDeleted &&
        (field?.isStatisticalField || field?.statisticalFunction)
    )
  );
}

function toAnalyticsList(payload: any) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.content)) return payload.content;
  return [];
}

function Analytics({ formID, form }: { formID: number; form?: any }) {
  const { companyBranding: company } = useCompany();
  const companyId = form?.companyId ?? company?.id ?? company?.companyId;
  const insightFields = statisticalFields(form);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["form analytics", formID, companyId],
    queryFn: services.formResponseAnalytics(Number(formID), companyId),
    enabled: Boolean(formID) && companyId != null && companyId !== "",
  });

  return (
    <div className="pb-40">
      <div className="mt-4 border border-[#E2E8F0] bg-white  rounded-lg  pt-3">
        <div className="flex justify-between items-center border-b px-5 border-[#E2E8F0] pb-4">
          <div className="font-semibold ">Response Insights</div>
        </div>

        {!companyId && (
          <AnalyticsGrid
            analytics={[]}
            emptyTitle="Missing company on this form"
            emptyMessage="Assign this form to a company, then reopen Insights. Analytics is loaded from /forms/response/analytics/{formId}/{companyId}."
          />
        )}

        {Boolean(companyId) && isLoading && (
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

        {!isLoading && isError && (
          <AnalyticsGrid
            analytics={[]}
            emptyTitle="Could not load insights"
            emptyMessage={
              (error as any)?.response?.data?.message ||
              (error as any)?.message ||
              "The analytics request failed. Check GET /forms/response/analytics/{formId}/{companyId}."
            }
          />
        )}

        {!isLoading && !isError && data && (
          <AnalyticsGrid
            analytics={toAnalyticsList(data)}
            emptyTitle={
              insightFields.length === 0
                ? "No analytics enabled for form fields"
                : "No insight data yet"
            }
            emptyMessage={
              insightFields.length === 0
                ? "In the form builder, select a Number, Dropdown, or Checkboxes field, set Insight Type to Count, Sum, or Average, then save. Insights also need at least one successful submission."
                : "This form has insight fields, but the API returned no stats. Submit the form successfully, then refresh. Older responses collected before Insight Type was set may not count."
            }
          />
        )}
      </div>
    </div>
  );
}

export default Analytics;
