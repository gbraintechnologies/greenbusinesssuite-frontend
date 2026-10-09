"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { FiFileText } from "react-icons/fi";
import services from "@/services";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import DashboardPanel from "@/components/Dashboard/DashboardPanel";

function formList(payload: any) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;
  return [];
}

function productHref(form: any) {
  const url = String(form?.url ?? "").trim();
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")) {
    return url;
  }
  return `/f/${form.id}`;
}

export default function ClientPortal() {
  const { data, isLoading } = useQuery({
    queryKey: ["client products"],
    queryFn: services.allForms(0, 50, "ALL"),
  });

  const products = formList(data).filter(
    (form: any) => String(form?.publishStatus ?? "").toUpperCase() === "PUBLISHED"
  );

  return (
    <div className="min-h-screen px-3 pb-20 pt-4 sm:px-5 sm:pt-5">
      <DashboardHeader
        title="Green Business Suite"
        subtitle="Products on your account. Open one to get started."
      />

      <DashboardPanel title="Products">
        {isLoading ? (
          <p className="text-sm text-slate-500">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-sm text-slate-500">
            No products have been published yet.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((form: any) => (
              <Link
                key={form.id}
                href={productHref(form)}
                className="rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-brand-300 hover:bg-brand-50"
              >
                <div className="mb-3 inline-flex rounded-lg bg-brand-50 p-2 text-brand-700">
                  <FiFileText size={18} />
                </div>
                <p className="font-medium text-slate-900">{form.name || "Untitled product"}</p>
                {form.description ? (
                  <p className="mt-1 text-sm text-slate-500">{form.description}</p>
                ) : null}
              </Link>
            ))}
          </div>
        )}
      </DashboardPanel>
    </div>
  );
}
