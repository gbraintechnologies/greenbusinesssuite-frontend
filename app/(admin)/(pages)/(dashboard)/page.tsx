"use client";

import React from "react";

import { useQuery } from "@tanstack/react-query";
import services from "@/services";

import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import KpiCard from "@/components/Dashboard/KpiCard";
import RecentCompaniesTable from "@/components/Dashboard/RecentCompaniesTable";
import { formatNumber } from "@/utils/dashboard/formatters";
import {
  FiBriefcase,
  FiFileText,
  FiLayers,
  FiUsers,
} from "react-icons/fi";

function Dashboard() {
  const { data: companies, isLoading: companiesLoading } = useQuery({
    queryKey: ["all companies"],
    queryFn: services.getAllCompanies(0, 1),
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["all users"],
    queryFn: services.allUsers(),
  });

  const { data: publishedFormsCount, isLoading: publishedLoading } = useQuery({
    queryKey: ["published forms count"],
    queryFn: services.publishedFormsCount(),
  });

  const { data: unpublishedFormsCount, isLoading: unpublishedLoading } =
    useQuery({
      queryKey: ["unpublished forms count"],
      queryFn: services.unpublishedFormsCount(),
    });

  const { data: companiesPage, isLoading: companiesListLoading } = useQuery({
    queryKey: ["dashboard recent companies"],
    queryFn: services.getAllCompanies(0, 5),
  });

  const recentCompanies = (companiesPage?.content ?? []).map((company: any) => ({
    id: company.id,
    serviceName: company.companyName,
    customerName: company.primaryContactEmail,
    amountPaid: company.status,
    datePaid: company.createdOn,
    paymentMethod: company.primaryContactPhoneNumber,
  }));

  return (
    <div className="min-h-screen bg-surface-muted px-3 pb-20 pt-4 sm:px-5 sm:pt-5">
      <DashboardHeader
        title="Dashboard"
        subtitle="Platform overview across all organizations"
      />

      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 xl:grid-cols-4">
        <KpiCard
          label="All Companies"
          value={formatNumber(companies?.totalElements)}
          isLoading={companiesLoading}
          icon={<FiLayers size={18} />}
        />
        <KpiCard
          label="All Users"
          value={formatNumber(users?.length)}
          isLoading={usersLoading}
          icon={<FiUsers size={18} />}
        />
        <KpiCard
          label="Published Forms"
          value={formatNumber(publishedFormsCount)}
          isLoading={publishedLoading}
          icon={<FiFileText size={18} />}
        />
        <KpiCard
          label="Unpublished Forms"
          value={formatNumber(unpublishedFormsCount)}
          isLoading={unpublishedLoading}
          icon={<FiBriefcase size={18} />}
        />
      </div>

      <div className="mt-4 sm:mt-6">
        <RecentCompaniesTable
          companies={companiesPage?.content ?? []}
          isLoading={companiesListLoading}
          viewAllHref="/company-setup"
        />
      </div>
    </div>
  );
}

export default Dashboard;
