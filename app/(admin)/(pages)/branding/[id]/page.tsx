"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { FiArrowLeft, FiEdit2, FiTrash2 } from "react-icons/fi";
import services from "@/services";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import DashboardPanel from "@/components/Dashboard/DashboardPanel";
import Loader from "@/components/Loader/Loader";
import Modal from "@/components/Modal/Modal";
import CompanyBrandAvatar from "@/components/CompanyBrand/CompanyBrandAvatar";

export default function BrandingDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["branding-by-id", id],
    queryFn: services.getCompanyBrandingById(id),
    enabled: Boolean(id),
  });

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await services.deleteBrandingById(id);
      toast.success("Branding deleted");
      await queryClient.invalidateQueries({ queryKey: ["branding"] });
      router.push("/branding");
    } catch {
      toast.error("Failed to delete branding");
    } finally {
      setDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader text="Loading branding" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="px-5 py-10">
        <p className="text-sm text-slate-600">Branding record not found.</p>
        <Link href="/branding" className="mt-3 inline-block text-sm text-brand-600">
          Back to list
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-muted px-3 pb-20 pt-4 sm:px-5 sm:pt-5">
      <DashboardHeader
        title={data.companyName || "Branding detail"}
        subtitle={`Tenancy ${data.tenancyId} · Record #${data.id}`}
        action={
          <div className="flex flex-wrap gap-2">
            <Link
              href="/branding"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700"
            >
              <FiArrowLeft size={16} /> Back
            </Link>
            <Link
              href={`/branding/edit/${data.id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
            >
              <FiEdit2 size={16} /> Edit
            </Link>
            <button
              type="button"
              onClick={() => setShowDelete(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600"
            >
              <FiTrash2 size={16} /> Delete
            </button>
          </div>
        }
      />

      <DashboardPanel title="Branding details">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          {data.logo?.startsWith("http") ? (
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <Image
                src={data.logo}
                alt={data.companyName || "logo"}
                fill
                className="object-contain p-2"
                unoptimized
              />
            </div>
          ) : (
            <CompanyBrandAvatar
              logoUrl={null}
              name={data.companyName}
              size="lg"
            />
          )}

          <dl className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Company name
              </dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">
                {data.companyName || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Company ID
              </dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">
                {data.companyId ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Tenancy ID
              </dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">
                {data.tenancyId || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Brand color
              </dt>
              <dd className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-900">
                <span
                  className="inline-block h-5 w-5 rounded-md border border-slate-200"
                  style={{ backgroundColor: data.color || "#e2e8f0" }}
                />
                {data.color || "—"}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Logo URL
              </dt>
              <dd className="mt-1 break-all text-sm text-slate-600">
                {data.logo || "—"}
              </dd>
            </div>
          </dl>
        </div>
      </DashboardPanel>

      <Modal
        isOpen={showDelete}
        setIsOpen={setShowDelete}
        title={`Delete branding for "${data.companyName}"?`}
      >
        <div className="p-5">
          <p className="text-sm text-slate-600">
            This permanently deletes branding record #{data.id}.
          </p>
          <div className="mt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowDelete(false)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={deleting}
              onClick={handleDelete}
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
