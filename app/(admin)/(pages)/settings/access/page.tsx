"use client";

import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FiKey, FiShield, FiUserCheck } from "react-icons/fi";
import services from "@/services";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import DashboardPanel from "@/components/Dashboard/DashboardPanel";
import KpiCard from "@/components/Dashboard/KpiCard";
import { formatNumber } from "@/utils/dashboard/formatters";

function toList(payload: any): any[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.permissions)) return payload.permissions;
  if (Array.isArray(payload?.authorities)) return payload.authorities;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

function permissionLabel(item: any): string {
  return (
    item?.permission_name ??
    item?.permissionName ??
    item?.name ??
    item?.authority ??
    (typeof item === "string" ? item : "Permission")
  );
}

function authorityLabel(item: any): string {
  return (
    item?.authority ??
    item?.roleName ??
    item?.role_name ??
    item?.name ??
    (typeof item === "string" ? item : "Authority")
  );
}

function AccessPage() {
  const {
    data: permissionsData,
    isLoading: permissionsLoading,
    isError: permissionsError,
  } = useQuery({
    queryKey: ["logged-in-user-permissions"],
    queryFn: services.getLoggedInUserPermissions(),
  });

  const {
    data: authoritiesData,
    isLoading: authoritiesLoading,
    isError: authoritiesError,
  } = useQuery({
    queryKey: ["logged-in-user-authorities"],
    queryFn: services.getLoggedInUserAuthorities(),
  });

  const {
    data: meData,
    isLoading: meLoading,
  } = useQuery({
    queryKey: ["logged-in-user"],
    queryFn: services.getLoggedInUser(),
  });

  const permissions = useMemo(
    () => toList(permissionsData),
    [permissionsData]
  );
  const authorities = useMemo(
    () => toList(authoritiesData),
    [authoritiesData]
  );

  const roleName =
    meData?.profiles?.[0]?.role_name ??
    meData?.profiles?.[0]?.roleName ??
    meData?.roleName ??
    meData?.role_name ??
    authorities[0]?.roleName ??
    authorities[0]?.name ??
    "—";

  const loading = permissionsLoading || authoritiesLoading || meLoading;

  return (
    <div>
      <DashboardHeader
        title="Access & permissions"
        subtitle="Review the roles and permissions attached to your account"
      />

      <div className="mb-5 grid grid-cols-2 gap-2.5 [&>*:last-child:nth-child(odd)]:col-span-2 sm:mb-6 sm:grid-cols-3 sm:gap-4 sm:[&>*:last-child:nth-child(odd)]:col-span-1">
        <KpiCard
          label="Primary role"
          value={roleName}
          isLoading={meLoading || authoritiesLoading}
          icon={<FiUserCheck size={18} />}
        />
        <KpiCard
          label="Permissions"
          value={formatNumber(permissions.length)}
          isLoading={permissionsLoading}
          icon={<FiKey size={18} />}
        />
        <KpiCard
          label="Authorities"
          value={formatNumber(authorities.length)}
          isLoading={authoritiesLoading}
          icon={<FiShield size={18} />}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <DashboardPanel title="Your permissions">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <AiOutlineLoading3Quarters
                size={22}
                className="animate-spin text-brand-600"
              />
            </div>
          ) : permissionsError ? (
            <p className="py-8 text-center text-sm text-slate-500">
              Could not load permissions for this account.
            </p>
          ) : permissions.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">
              No permissions were returned for your account.
            </p>
          ) : (
            <ul className="max-h-[28rem] space-y-2 overflow-y-auto pr-1">
              {permissions.map((item, index) => (
                <li
                  key={`perm-${index}-${permissionLabel(item)}`}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <FiKey size={14} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-slate-800">
                      {permissionLabel(item)}
                    </span>
                    {(item?.description || item?.permission_description) && (
                      <span className="block truncate text-xs text-slate-500">
                        {item.description || item.permission_description}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </DashboardPanel>

        <DashboardPanel title="Authorities">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <AiOutlineLoading3Quarters
                size={22}
                className="animate-spin text-brand-600"
              />
            </div>
          ) : authoritiesError ? (
            <p className="py-8 text-center text-sm text-slate-500">
              Could not load authorities for this account.
            </p>
          ) : authorities.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">
              No authorities were returned for your account.
            </p>
          ) : (
            <ul className="max-h-[28rem] space-y-2 overflow-y-auto pr-1">
              {authorities.map((item, index) => (
                <li
                  key={`auth-${index}-${authorityLabel(item)}`}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <FiShield size={14} />
                  </span>
                  <span className="truncate text-sm font-medium text-slate-800">
                    {authorityLabel(item)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </DashboardPanel>
      </div>
    </div>
  );
}

export default AccessPage;
