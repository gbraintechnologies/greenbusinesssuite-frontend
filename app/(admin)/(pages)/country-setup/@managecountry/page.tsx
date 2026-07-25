"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GoPlusCircle } from "react-icons/go";
import { FiGlobe, FiLayers, FiMap } from "react-icons/fi";
import { toast } from "sonner";
import services from "@/services";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import DashboardPanel from "@/components/Dashboard/DashboardPanel";
import KpiCard from "@/components/Dashboard/KpiCard";
import CountriesTable, {
  CountryRow,
} from "@/components/Dashboard/CountriesTable";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import ItemsPerPageSelector from "@/components/Pagination/ItemsPerPageSelector";
import { formatNumber } from "@/utils/dashboard/formatters";
import { deletecountryWithAssoc } from "@/services/features/jurisdictionsService";

function mapCountryRow(country: any): CountryRow {
  return {
    id: country.id,
    name: country.countryName ?? country.name ?? "—",
    parentLevels: country.addressingScheme?.parentLevels?.length,
    childLevels: country.addressingScheme?.parentLevels?.reduce(
      (sum: number, level: any) => sum + (level?.childLevels?.length ?? 0),
      0
    ),
  };
}

function CountrySetup() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(15);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["allCountries", page, limit],
    queryFn: services.allJurisdictions(page, limit),
  });

  const { data: searchData, isLoading: searchLoading } = useQuery({
    queryKey: ["searchCountry", searchTerm],
    queryFn: () => services.getCountryInfoByName(searchTerm),
    enabled: searchTerm.trim().length > 1,
  });

  const isSearching = searchTerm.trim().length > 1;

  useEffect(() => {
    setPage(0);
  }, [searchTerm, limit]);

  const countryRows = useMemo(() => {
    if (isSearching) {
      if (!searchData) return [];
      const list = Array.isArray(searchData) ? searchData : [searchData];
      return list.filter(Boolean).map(mapCountryRow);
    }

    const list = data?.countries ?? data?.content ?? [];
    return Array.isArray(list) ? list.map(mapCountryRow) : [];
  }, [data, searchData, isSearching]);

  const totalCount =
    data?.totalElements ??
    data?.total ??
    data?.countries?.length ??
    countryRows.length;

  const configuredCount = countryRows.filter(
    (row) => (row.parentLevels ?? 0) > 0
  ).length;

  const handleDelete = async (id: number) => {
    if (
      !window.confirm(
        "Delete this country jurisdiction and its associated levels?"
      )
    ) {
      return;
    }

    try {
      await deletecountryWithAssoc(id);
      toast.success("Country deleted successfully");
      await queryClient.invalidateQueries({ queryKey: ["allCountries"] });
      await queryClient.invalidateQueries({ queryKey: ["searchCountry"] });
    } catch (error) {
      console.error("Error deleting country:", error);
      toast.error("Failed to delete country");
    }
  };

  return (
    <div className="min-h-screen bg-surface-muted px-5 pb-20 pt-5">
      <DashboardHeader
        title="Country / Jurisdiction Setup"
        subtitle="Configure countries, addressing schemes, and regional hierarchies"
        action={
          <Link href="/country-setup/new-individual">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-brand-700 hover:shadow-md"
            >
              <GoPlusCircle size={18} />
              Add New Country
            </button>
          </Link>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-2.5 [&>*:last-child:nth-child(odd)]:col-span-2 sm:mb-6 sm:grid-cols-3 sm:gap-4 sm:[&>*:last-child:nth-child(odd)]:col-span-1">
        <KpiCard
          label="Total Countries"
          value={formatNumber(totalCount)}
          isLoading={isLoading}
          icon={<FiGlobe size={18} />}
        />
        <KpiCard
          label="On this page"
          value={formatNumber(countryRows.length)}
          isLoading={isLoading || searchLoading}
          icon={<FiMap size={18} />}
          trend={{
            value: isSearching ? "Search results" : "Current view",
            direction: "neutral",
          }}
        />
        <KpiCard
          label="With hierarchy"
          value={formatNumber(configuredCount)}
          isLoading={isLoading || searchLoading}
          icon={<FiLayers size={18} />}
          trend={{ value: "Parent levels set", direction: "up" }}
        />
      </div>

      <DashboardPanel title="All Jurisdictions">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full min-w-[240px] sm:w-72">
            <SearchBox
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder="Search by country name"
            />
          </div>

          {!isSearching && (
            <div className="flex flex-wrap items-center gap-3">
              <ItemsPerPageSelector limit={limit} setLimit={setLimit} />
              <Pagination
                limit={limit}
                variant="no-text"
                page={page}
                currentData={countryRows}
                setPage={setPage}
              />
            </div>
          )}
        </div>

        <CountriesTable
          countries={countryRows}
          isLoading={isLoading || (isSearching && searchLoading)}
          onDelete={handleDelete}
          canEdit={true}
          canDelete={true}
        />
      </DashboardPanel>
    </div>
  );
}

export default CountrySetup;
