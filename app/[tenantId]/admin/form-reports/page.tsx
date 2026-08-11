"use client";

import React from "react";
import Nav from "../forms/components/Nav";

import { useQuery } from "@tanstack/react-query";
import services from "@/services";

import StatsBlock from "@/components/StatsBlock/StatsBlock";
import useCompany from "@/hooks/useCompany";
import { formatNumber } from "@/utils/dashboard/formatters";

function toStatNumber(value: unknown) {
  if (value == null) return 0;
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    const candidate =
      record.count ??
      record.total ??
      record.value ??
      record.data ??
      record.openedLinks ??
      record.ignoredLinks;
    if (typeof candidate === "number" || typeof candidate === "string") {
      return toStatNumber(candidate);
    }
  }
  return 0;
}

function CompanyFormReports() {
  const { companyBranding: company } = useCompany();
  const companyId = company?.id;

  const { data: publishedFormsIds, isLoading: publishedIdsLoading } = useQuery({
    queryKey: ["published forms ids", companyId],
    queryFn: services.publishedFomsOfCompany(companyId),
    enabled: !!companyId,
  });

  const publishedIdsKey = Array.isArray(publishedFormsIds)
    ? publishedFormsIds.join(",")
    : "";
  const hasPublishedForms = publishedIdsKey.length > 0;

  const { data: uniqueUsersCount, isLoading: usersLoading } = useQuery({
    queryKey: ["unique users count", companyId],
    queryFn: services.uniqueUsersCount(companyId),
    enabled: !!companyId,
  });

  const { data: totalEntries, isLoading: entriesLoading } = useQuery({
    queryKey: ["total entries per company", companyId],
    queryFn: services.totalEntries(companyId),
    enabled: !!companyId,
  });

  const { data: linksOpened, isLoading: linksOpenedLoading } = useQuery({
    queryKey: ["links opened per company", companyId, publishedIdsKey],
    queryFn: services.linksOpened(companyId, publishedIdsKey),
    enabled: !!companyId && hasPublishedForms,
  });

  const { data: linksIgnored, isLoading: linksIgnoredLoading } = useQuery({
    queryKey: ["ignored links per company", companyId, publishedIdsKey],
    queryFn: services.ignoredLinks(companyId, publishedIdsKey),
    enabled: !!companyId && hasPublishedForms,
  });

  const { data: formStats, isLoading: formStatsLoading } = useQuery({
    queryKey: ["form stats completed/incomplete", companyId],
    queryFn: services.companyFormStats(companyId),
    enabled: !!companyId,
  });

  const linksOpenedReady = !publishedIdsLoading && (!hasPublishedForms || !linksOpenedLoading);
  const linksIgnoredReady = !publishedIdsLoading && (!hasPublishedForms || !linksIgnoredLoading);

  const linksOpenedValue = linksOpenedReady
    ? hasPublishedForms
      ? toStatNumber(linksOpened)
      : 0
    : undefined;

  const linksIgnoredValue = linksIgnoredReady
    ? hasPublishedForms
      ? toStatNumber(linksIgnored)
      : 0
    : undefined;

  return (
    <div className="mt-4 min-h-screen px-5 py-2 pb-20">
      <Nav headerLeftTitle="Form Reports" />
      <div className="mt-4">
        <StatsBlock
          stats={[
            {
              label: "Links Opened",
              value: formatNumber(linksOpenedValue ?? 0),
              isLoading: !linksOpenedReady,
            },
            {
              label: "Ignored Forms",
              value: formatNumber(linksIgnoredValue ?? 0),
              isLoading: !linksIgnoredReady,
            },
            {
              label: "Total Customers",
              value: formatNumber(uniqueUsersCount),
              isLoading: usersLoading,
            },
          ]}
        />
      </div>
      <div className="mt-4">
        <StatsBlock
          stats={[
            {
              label: "Total Number Of Entries",
              value: formatNumber(totalEntries),
              isLoading: entriesLoading,
            },
            {
              label: "Completed Submissions",
              value: formatNumber(formStats?.completedForms),
              isLoading: formStatsLoading,
            },
            {
              label: "Incomplete Submissions",
              value: formatNumber(formStats?.uncompletedForms),
              isLoading: formStatsLoading,
            },
          ]}
        />
      </div>
    </div>
  );
}

export default CompanyFormReports;
