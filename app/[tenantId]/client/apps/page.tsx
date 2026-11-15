"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { FiArrowUpRight, FiSearch } from "react-icons/fi";
import services from "@/services";
import useCompany from "@/hooks/useCompany";
import type { SuiteProduct } from "@/lib/suiteProducts";

function formList(payload: any) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;
  return [];
}

function formHref(form: any, tenant?: string) {
  const url = String(form?.url ?? "").trim();
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("/")
  ) {
    return url;
  }
  if (tenant && form?.id) {
    return `/${tenant}/client/services`;
  }
  return `/f/${form.id}`;
}

function matches(query: string, product: SuiteProduct) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return [product.name, product.tagline, product.description, product.category]
    .join(" ")
    .toLowerCase()
    .includes(needle);
}

function ProductCard({ product }: { product: SuiteProduct }) {
  const external =
    product.href.startsWith("http://") || product.href.startsWith("https://");

  return (
    <a
      href={product.href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="group flex min-h-[220px] flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-sm"
    >
      <div>
        {product.logoUrl ? (
          <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <Image
              src={product.logoUrl}
              alt=""
              fill
              className="object-contain p-1.5"
              unoptimized
            />
          </div>
        ) : (
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg font-semibold text-white ${product.accent}`}
          >
            {product.mark}
          </div>
        )}
        <p className="mt-4 text-lg font-semibold text-slate-900">
          {product.name}
        </p>
        <p className="mt-1 text-sm font-medium text-[#0b57d0]">
          {product.tagline}
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {product.description}
        </p>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium text-slate-700 ${product.wash}`}
        >
          {product.category}
        </span>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-[#0b57d0]">
          Open
          <FiArrowUpRight className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </a>
  );
}

export default function ClientAppsPage() {
  const { companyBranding: company } = useCompany();
  const tenant = company?.company_identifier;
  const companyId =
    company?.companyId ?? company?.company_id ?? company?.id ?? null;
  const [query, setQuery] = useState("");

  const { data: catalog = [] } = useQuery({
    queryKey: ["published suite apps tenant client"],
    queryFn: services.listPublishedSuiteApps,
    staleTime: 60_000,
  });

  const { data } = useQuery({
    queryKey: ["client apps company forms", companyId],
    queryFn: services.getFormsByCompanyId(String(companyId), 0, 50, "ALL"),
    enabled: Boolean(companyId),
  });

  const products = useMemo(() => {
    const catalogUrls = new Set(
      catalog.map((product) => product.href.replace(/\/$/, ""))
    );
    const extras: SuiteProduct[] = formList(data)
      .filter(
        (form: any) =>
          String(form?.publishStatus ?? "").toUpperCase() === "PUBLISHED"
      )
      .filter(
        (form: any) => !catalogUrls.has(formHref(form, tenant).replace(/\/$/, ""))
      )
      .map((form: any) => ({
        id: `form-${form.id}`,
        name: form.name || "Untitled app",
        tagline: "Published service",
        description:
          form.description || "Open this service from your customer portal.",
        href: formHref(form, tenant),
        category: "Service",
        published: true,
        mark: String(form.name || "S").trim().charAt(0).toUpperCase() || "S",
        accent: "bg-[#0b3d2e]",
        wash: "bg-[#f4faf6]",
      }));

    return [...catalog, ...extras].filter((product) => matches(query, product));
  }, [catalog, data, query, tenant]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-5 pb-20 pt-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Apps</h1>
          <p className="mt-1 text-sm text-slate-500">
            Tools and published services available through{" "}
            {company?.name || "your company"}.
          </p>
        </div>
        <label className="relative block w-full sm:max-w-xs">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search apps"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-slate-300"
          />
        </label>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="mt-10 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <p className="font-semibold text-slate-900">No apps match your search</p>
          <p className="mt-2 text-sm text-slate-500">
            Try a different keyword or clear the search field.
          </p>
        </div>
      )}
    </div>
  );
}
