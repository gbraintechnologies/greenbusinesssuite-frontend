"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiArrowUpRight, FiSearch } from "react-icons/fi";
import services from "@/services";
import useUser from "@/hooks/useUser";
import useAuth from "@/hooks/useAuth";
import { publishedSuiteProducts, type SuiteProduct } from "@/lib/suiteProducts";

function formList(payload: any) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;
  return [];
}

function formHref(form: any) {
  const url = String(form?.url ?? "").trim();
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")) {
    return url;
  }
  return `/f/${form.id}`;
}

function greetingFor(date: Date) {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function matches(query: string, product: SuiteProduct) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return [product.name, product.tagline, product.description, product.category]
    .join(" ")
    .toLowerCase()
    .includes(needle);
}

function ProductLink({
  product,
  className,
  children,
}: {
  product: SuiteProduct;
  className?: string;
  children: React.ReactNode;
}) {
  const external = product.href.startsWith("http://") || product.href.startsWith("https://");
  return (
    <a
      href={product.href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={className}
    >
      {children}
    </a>
  );
}

function ProductCard({ product }: { product: SuiteProduct }) {
  return (
    <ProductLink
      product={product}
      className="group flex min-h-[240px] flex-col justify-between rounded-[28px] border border-[#e3e3e3] bg-white p-6 shadow-[0_1px_2px_rgba(60,64,67,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(60,64,67,0.14)]"
    >
      <div>
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-semibold text-white ${product.accent}`}
        >
          {product.mark}
        </div>
        <p className="mt-5 text-xl font-medium tracking-tight">{product.name}</p>
        <p className="mt-1 text-sm font-medium text-[#0b57d0]">{product.tagline}</p>
        <p className="mt-2 text-sm leading-6 text-[#444746]">{product.description}</p>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <span className={`rounded-full px-3 py-1 text-xs font-medium text-[#1f1f1f] ${product.wash}`}>
          {product.category}
        </span>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-[#0b57d0]">
          Open
          <FiArrowUpRight className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </ProductLink>
  );
}

export default function ClientPortal() {
  const { user } = useUser();
  const { auth } = useAuth();
  const person = user ?? auth;
  const firstName = person?.firstName ?? person?.first_name;
  const [query, setQuery] = useState("");
  const catalog = useMemo(() => publishedSuiteProducts(), []);

  const { data } = useQuery({
    queryKey: ["client products"],
    queryFn: services.allForms(0, 50, "ALL"),
  });

  const products = useMemo(() => {
    const catalogUrls = new Set(catalog.map((product) => product.href.replace(/\/$/, "")));
    const extras: SuiteProduct[] = formList(data)
      .filter((form: any) => String(form?.publishStatus ?? "").toUpperCase() === "PUBLISHED")
      .filter((form: any) => !catalogUrls.has(formHref(form).replace(/\/$/, "")))
      .map((form: any) => ({
        id: `form-${form.id}`,
        name: form.name || "Untitled product",
        tagline: "Published form",
        description: form.description || "Open this product to continue.",
        href: formHref(form),
        category: "Form",
        published: true,
        mark: String(form.name || "F").trim().charAt(0).toUpperCase() || "F",
        accent: "bg-[#5b21b6]",
        wash: "bg-[#f5f3ff]",
      }));
    return [...catalog, ...extras];
  }, [catalog, data]);

  const visible = products.filter((product) => matches(query, product));

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="hidden w-64 shrink-0 border-r border-[#e3e3e3] bg-white px-3 py-6 md:block">
        <p className="px-3 text-xs font-medium uppercase tracking-[0.08em] text-[#80868b]">
          Your products
        </p>
        <nav className="mt-3 space-y-1">
          {catalog.map((product) => (
            <ProductLink
              key={product.id}
              product={product}
              className="flex items-center gap-3 rounded-full px-3 py-2 text-sm text-[#1f1f1f] transition hover:bg-[#f0f4f9]"
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-xl text-sm font-semibold text-white ${product.accent}`}
              >
                {product.mark}
              </span>
              <span className="min-w-0">
                <span className="block truncate font-medium">{product.name}</span>
                <span className="block truncate text-xs text-[#444746]">{product.category}</span>
              </span>
            </ProductLink>
          ))}
        </nav>
      </aside>

      <section className="min-w-0 flex-1 px-4 py-8 sm:px-8 sm:py-10">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-medium text-[#444746]">Green Business Suite</p>
          <h1 className="mt-1 text-3xl font-medium tracking-tight sm:text-[2.5rem] sm:leading-tight">
            {`${greetingFor(new Date())}${firstName ? `, ${firstName}` : ""}`}
          </h1>
          <p className="mt-2 max-w-xl text-base text-[#444746]">
            Your products are ready. Open one to get started.
          </p>

          <label className="mt-8 flex max-w-xl items-center gap-3 rounded-full border border-[#e3e3e3] bg-white px-4 py-3 shadow-[0_1px_2px_rgba(60,64,67,0.08)]">
            <FiSearch className="shrink-0 text-[#444746]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products"
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#80868b]"
            />
          </label>

          <div className="mt-8 flex items-end justify-between">
            <h2 className="text-lg font-medium">Products</h2>
            <p className="text-sm text-[#444746]">{visible.length} published</p>
          </div>

          {visible.length === 0 ? (
            <p className="mt-6 text-sm text-[#444746]">No products match that search.</p>
          ) : (
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {visible.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
