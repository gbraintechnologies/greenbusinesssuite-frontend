"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { GoPlusCircle } from "react-icons/go";
import { FiBriefcase, FiCheckCircle, FiPauseCircle } from "react-icons/fi";
import services from "@/services";
import useAdmin from "@/hooks/useAdmin";
import { PermissionTypes } from "@/types/permissionTypes";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import DashboardPanel from "@/components/Dashboard/DashboardPanel";
import KpiCard from "@/components/Dashboard/KpiCard";
import CompaniesTable from "@/components/Dashboard/CompaniesTable";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import ItemsPerPageSelector from "@/components/Pagination/ItemsPerPageSelector";
import { formatNumber } from "@/utils/dashboard/formatters";

export interface IFilter {
  id: number;
  name: string;
  value: string;
}

const STATUS_FILTERS: IFilter[] = [
  { id: 1, name: "All", value: "all" },
  { id: 2, name: "Active", value: "ACTIVE" },
  { id: 3, name: "Inactive", value: "INACTIVE" },
  { id: 4, name: "Suspended", value: "SUSPENDED" },
];

function CompanySetup() {
  const [activeFilter, setActiveFilter] = useState<IFilter>(STATUS_FILTERS[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);

  const { checkPermission } = useAdmin();

  const { data: companies, isLoading } = useQuery({
    queryKey: ["companies", page, limit, activeFilter.value, searchTerm],
    queryFn:
      searchTerm.length > 1
        ? services.getCompanyByName(searchTerm)
        : activeFilter.value !== "all"
          ? services.filterCompaniesByStatus(activeFilter.value)
          : services.getAllCompanies(page * limit, limit),
  });

  const { data: activeCompanies } = useQuery({
    queryKey: ["companies-stats-active"],
    queryFn: services.filterCompaniesByStatus("ACTIVE"),
  });

  const { data: inactiveCompanies } = useQuery({
    queryKey: ["companies-stats-inactive"],
    queryFn: services.filterCompaniesByStatus("INACTIVE"),
  });

  const companyRows = useMemo(
    () => (Array.isArray(companies) ? companies : companies?.content ?? []),
    [companies]
  );

  const totalCount = Array.isArray(companies)
    ? companies.length
    : companies?.totalElements ?? companyRows.length;

  const activeCount = Array.isArray(activeCompanies)
    ? activeCompanies.length
    : activeCompanies?.totalElements ?? 0;

  const inactiveCount = Array.isArray(inactiveCompanies)
    ? inactiveCompanies.length
    : inactiveCompanies?.totalElements ?? 0;

  return (
    <div className="min-h-screen bg-surface-muted px-3 pb-20 pt-4 sm:px-5 sm:pt-5">
      <DashboardHeader
        title="Companies"
        subtitle="Manage organizations, tenants, and company accounts"
        action={
          <Link href="/company-setup/create" className="w-full sm:w-auto">
            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-brand-700 hover:shadow-md sm:w-auto sm:px-5"
            >
              <GoPlusCircle size={18} />
              Create New Company
            </button>
          </Link>
        }
      />

      <div className="mb-5 grid grid-cols-3 gap-2 sm:mb-6 sm:gap-4">
        <KpiCard
          label="Total Companies"
          value={formatNumber(totalCount)}
          isLoading={isLoading}
          icon={<FiBriefcase size={16} />}
        />
        <KpiCard
          label="Active"
          value={formatNumber(activeCount)}
          icon={<FiCheckCircle size={16} />}
          trend={{ value: "Live", direction: "up" }}
        />
        <KpiCard
          label="Inactive"
          value={formatNumber(inactiveCount)}
          icon={<FiPauseCircle size={16} />}
          trend={{ value: "Paused", direction: "neutral" }}
        />
      </div>

      <DashboardPanel title="All Companies">
        <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:gap-4">
          {/* Status filters — horizontal scroll on mobile */}
          <div className="-mx-1 overflow-x-auto no-scrollbar px-1">
            <div className="flex w-max gap-2">
              {STATUS_FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => {
                    setActiveFilter(filter);
                    setPage(0);
                  }}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all sm:px-4 sm:text-sm ${
                    activeFilter.id === filter.id
                      ? "bg-brand-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-brand-50 hover:text-brand-700"
                  }`}
                >
                  {filter.name}
                </button>
              ))}
            </div>
          </div>

          {checkPermission(PermissionTypes.SEARCH_COMPANY) && (
            <div className="w-full sm:max-w-xs">
              <SearchBox
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                placeholder="Search by company name"
              />
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2">
            <ItemsPerPageSelector limit={limit} setLimit={setLimit} />
            <Pagination
              limit={limit}
              variant="no-text"
              page={page}
              currentData={companyRows}
              setPage={setPage}
            />
          </div>
        </div>

        <CompaniesTable companies={companyRows} isLoading={isLoading} />
      </DashboardPanel>
    </div>
  );
}

export default CompanySetup;
