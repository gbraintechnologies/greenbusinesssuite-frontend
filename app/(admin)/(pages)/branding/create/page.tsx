"use client";

import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import DashboardPanel from "@/components/Dashboard/DashboardPanel";
import BrandingForm from "../components/BrandingForm";

export default function CreateBrandingPage() {
  return (
    <div className="min-h-screen bg-surface-muted px-3 pb-20 pt-4 sm:px-5 sm:pt-5">
      <DashboardHeader
        title="Create branding"
        subtitle="Set logo and color for a company tenant"
        action={
          <Link
            href="/branding"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700"
          >
            <FiArrowLeft size={16} /> Back
          </Link>
        }
      />
      <DashboardPanel title="New branding">
        <BrandingForm mode="create" />
      </DashboardPanel>
    </div>
  );
}
