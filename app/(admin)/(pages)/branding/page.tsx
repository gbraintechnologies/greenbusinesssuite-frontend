"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FiEdit2, FiEye, FiPlus, FiTrash2 } from "react-icons/fi";
import services from "@/services";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import DashboardPanel from "@/components/Dashboard/DashboardPanel";
import Pagination from "@/components/Pagination/Pagination";
import ItemsPerPageSelector from "@/components/Pagination/ItemsPerPageSelector";
import Modal from "@/components/Modal/Modal";
import CompanyBrandAvatar from "@/components/CompanyBrand/CompanyBrandAvatar";
import Loader from "@/components/Loader/Loader";
import type { CompanyBranding } from "@/types";

type DeleteTarget = {
  type: "id" | "tenant";
  id?: number;
  tenancyId?: string;
  name?: string;
} | null;

function BrandingPage() {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const [deleting, setDeleting] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["branding", page, limit],
    queryFn: services.getAllBranding(page, limit),
  });

  const rows: CompanyBranding[] = useMemo(() => {
    if (Array.isArray(data)) return data;
    return data?.content ?? [];
  }, [data]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      if (deleteTarget.type === "id" && deleteTarget.id != null) {
        await services.deleteBrandingById(deleteTarget.id);
      } else if (deleteTarget.type === "tenant" && deleteTarget.tenancyId) {
        await services.deleteBrandingByTenantId(deleteTarget.tenancyId);
      }
      toast.success("Branding deleted");
      setDeleteTarget(null);
      await queryClient.invalidateQueries({ queryKey: ["branding"] });
    } catch {
      toast.error("Failed to delete branding");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-muted px-3 pb-20 pt-4 sm:px-5 sm:pt-5">
      <DashboardHeader
        title="Company Branding"
        subtitle="Manage logos, colors, and branding for all tenants"
        action={
          <Link
            href="/branding/create"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
          >
            <FiPlus size={16} />
            New Branding
          </Link>
        }
      />

      <DashboardPanel title="All Brandings">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <ItemsPerPageSelector limit={limit} setLimit={setLimit} />
          <Pagination
            limit={limit}
            variant="no-text"
            page={page}
            currentData={rows}
            setPage={setPage}
          />
        </div>

        {isLoading ? (
          <Loader text="Loading branding records" />
        ) : rows.length === 0 ? (
          <div className="py-16 text-center text-sm text-slate-500">
            No company branding records found.
          </div>
        ) : (
          <div className="w-full min-w-0 overflow-x-auto">
            <table className="w-full min-w-[720px] table-fixed text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="w-[28%] pb-3 pr-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Company
                  </th>
                  <th className="w-[22%] pb-3 pr-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Tenancy
                  </th>
                  <th className="w-[14%] pb-3 pr-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Color
                  </th>
                  <th className="w-[12%] pb-3 pr-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    ID
                  </th>
                  <th className="w-[24%] pb-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rows.map((item) => (
                  <tr
                    key={item.id}
                    className="transition-colors hover:bg-brand-50/40"
                  >
                    <td className="py-4 pr-3">
                      <div className="flex min-w-0 items-center gap-3">
                        {item.logo?.startsWith("http") ? (
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
                            <Image
                              src={item.logo}
                              alt={item.companyName || "logo"}
                              fill
                              className="object-contain p-0.5"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <CompanyBrandAvatar
                            logoUrl={null}
                            name={item.companyName}
                            size="sm"
                          />
                        )}
                        <p className="truncate font-semibold text-slate-900">
                          {item.companyName || "—"}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 pr-3">
                      <span className="inline-flex max-w-full truncate rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
                        {item.tenancyId || "—"}
                      </span>
                    </td>
                    <td className="py-4 pr-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-5 w-5 rounded-md border border-slate-200"
                          style={{ backgroundColor: item.color || "#e2e8f0" }}
                        />
                        <span className="truncate text-slate-600">
                          {item.color || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 pr-3 text-slate-500">#{item.id}</td>
                    <td className="py-4">
                      <div className="flex flex-wrap items-center justify-end gap-1.5">
                        <Link
                          href={`/branding/${item.id}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700"
                        >
                          <FiEye size={12} /> View
                        </Link>
                        <Link
                          href={`/branding/edit/${item.id}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700"
                        >
                          <FiEdit2 size={12} /> Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteTarget({
                              type: "id",
                              id: item.id,
                              name: item.companyName,
                            })
                          }
                          className="inline-flex items-center gap-1 rounded-lg border border-red-100 bg-white px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          <FiTrash2 size={12} /> Delete
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteTarget({
                              type: "tenant",
                              tenancyId: item.tenancyId,
                              name: item.companyName,
                            })
                          }
                          className="inline-flex items-center gap-1 rounded-lg border border-red-100 bg-white px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                          title="Delete by tenant ID"
                        >
                          Del tenant
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DashboardPanel>

      <Modal
        isOpen={Boolean(deleteTarget)}
        setIsOpen={(open: boolean) => {
          if (!open) setDeleteTarget(null);
        }}
        title={
          deleteTarget?.type === "tenant"
            ? `Delete branding for tenant "${deleteTarget.tenancyId}"?`
            : `Delete branding for "${deleteTarget?.name ?? "company"}"?`
        }
      >
        <div className="p-5">
          <p className="text-sm text-slate-600">
            {deleteTarget?.type === "tenant"
              ? "This permanently removes branding linked to this tenancy ID."
              : "This permanently deletes this branding record by ID."}
          </p>
          <div className="mt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={deleting}
              onClick={confirmDelete}
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default BrandingPage;
