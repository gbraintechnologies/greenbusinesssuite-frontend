"use client";

import React from "react";

import { useQuery } from "@tanstack/react-query";
import services from "@/services";

import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import KpiCard from "@/components/Dashboard/KpiCard";
import RecentCompaniesTable from "@/components/Dashboard/RecentCompaniesTable";
import { formatNumber } from "@/utils/dashboard/formatters";
import { FiBriefcase, FiFileText, FiUsers } from "react-icons/fi";

function Dashboard() {
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

  const clientList = Array.isArray(users) ? users : users?.content ?? [];
  const recentClients = clientList
    .slice(0, 5)
    .map((user: any) => ({
      id: user.id,
      companyName: `${user.firstName ?? user.first_name ?? ""} ${
        user.lastName ?? user.last_name ?? ""
      }`.trim() || user.username || user.email,
      primaryContactEmail: user.email,
      status: user.status,
      createdOn: user.createdOn ?? user.created_on,
    }));

  return (
    <div className="min-h-screen bg-surface-muted px-3 pb-20 pt-4 sm:px-5 sm:pt-5">
      <DashboardHeader
        title="Green Business Suite"
        subtitle="One company. Clients and products live on this account."
      />

      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 xl:grid-cols-3">
        <KpiCard
          label="Clients"
          value={formatNumber(clientList.length)}
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
          companies={recentClients}
          isLoading={usersLoading}
          viewAllHref="/usermanagement"
          title="Recent clients"
          emptyLabel="No clients yet."
          nameLabel="Client"
        />
      </div>
    </div>
  );
}

export default Dashboard;
