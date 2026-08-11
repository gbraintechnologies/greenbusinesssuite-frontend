"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { FiArrowLeft } from "react-icons/fi";
import services from "@/services";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import DashboardPanel from "@/components/Dashboard/DashboardPanel";
import Loader from "@/components/Loader/Loader";
import BrandingForm from "../../components/BrandingForm";

export default function EditBrandingPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["branding-by-id", id],
    queryFn: services.getCompanyBrandingById(id),
    enabled: Boolean(id),
  });

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
        title="Edit branding"
        subtitle={data.companyName || `Record #${data.id}`}
        action={
          <Link
            href={`/branding/${data.id}`}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700"
          >
            <FiArrowLeft size={16} /> Back
          </Link>
        }
      />
      <DashboardPanel title="Update branding">
        <BrandingForm mode="edit" initial={data} />
      </DashboardPanel>
    </div>
  );
}
