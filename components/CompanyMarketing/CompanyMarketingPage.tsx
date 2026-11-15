"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { FiArrowUpRight } from "react-icons/fi";
import services from "@/services";
import useCompany from "@/hooks/useCompany";
import useAuth from "@/hooks/useAuth";
import useUser from "@/hooks/useUser";
import CompanyBrandAvatar from "@/components/CompanyBrand/CompanyBrandAvatar";
import type { SuiteProduct } from "@/lib/suiteProducts";

function formList(payload: any) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;
  return [];
}

const gallery = [
  {
    src: "/landing/hero.jpg",
    title: "Programs that move",
    copy: "Publish services and collect applications in one place.",
  },
  {
    src: "/landing/team.jpg",
    title: "Built for your customers",
    copy: "A branded portal for apply, track, and follow-through.",
  },
  {
    src: "/landing/desk.jpg",
    title: "Documents on record",
    copy: "Keep uploads and issued files attached to every application.",
  },
] as const;

export default function CompanyMarketingPage({
  tenantId,
}: {
  tenantId: string;
}) {
  const { companyBranding: company } = useCompany();
  const { auth } = useAuth();
  const { user } = useUser();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);
  const brand = company?.color || "#1FA35C";
  const name = company?.name || tenantId || "Company";
  const loggedIn = Boolean(auth?.access_token && user);

  const companyId =
    company?.companyId ?? company?.company_id ?? company?.id ?? null;

  const { data: formsPayload } = useQuery({
    queryKey: ["marketing company forms", companyId],
    queryFn: services.getFormsByCompanyId(String(companyId), 0, 24, "ALL"),
    enabled: Boolean(companyId),
    retry: 0,
  });

  const { data: apps = [] as SuiteProduct[] } = useQuery({
    queryKey: ["published suite apps marketing"],
    queryFn: services.listPublishedSuiteApps,
    staleTime: 60_000,
  });

  const servicesList = useMemo(() => {
    return formList(formsPayload)
      .filter(
        (form: any) =>
          String(form?.publishStatus ?? "").toUpperCase() === "PUBLISHED"
      )
      .slice(0, 8);
  }, [formsPayload]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const returnTo = `/${tenantId}/client/dashboard`;
  // Green account (platform) login — not company admin auth
  const loginHref = `/auth?redirect=${encodeURIComponent(returnTo)}&from=${encodeURIComponent(tenantId)}`;
  const signUpHref = `/auth/sign-up?redirect=${encodeURIComponent(returnTo)}&from=${encodeURIComponent(tenantId)}`;
  const portalHref = returnTo;

  return (
    <div className="min-h-screen bg-[#f7faf8] text-[#10261c]">
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 text-[#10261c] shadow-[0_10px_30px_-22px_rgba(16,38,28,0.45)] backdrop-blur"
            : "bg-transparent text-white"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-[4.25rem] sm:px-6">
          <Link href={`/${tenantId}`} className="flex items-center gap-3">
            <CompanyBrandAvatar
              logoUrl={company?.logo}
              name={name}
              size="sm"
              className="h-9 w-9 rounded-lg"
            />
            <span className="font-[family-name:var(--font-landing-display)] text-[15px] font-semibold tracking-tight sm:text-base">
              {name}
            </span>
          </Link>

          <nav
            className={`hidden items-center gap-6 text-sm font-medium md:flex ${
              scrolled ? "text-[#3d5649]" : "text-white/85"
            }`}
          >
            <a href="#services">Services</a>
            <a href="#apps">Apps</a>
            <a href="#gallery">About</a>
            <a href="#get-started">Get started</a>
          </nav>

          <div className="flex items-center gap-2">
            {loggedIn ? (
              <Link
                href={portalHref}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95"
                style={{ backgroundColor: brand }}
              >
                Open portal
              </Link>
            ) : (
              <>
                <Link
                  href={loginHref}
                  className={`hidden rounded-xl px-3 py-2.5 text-sm font-semibold sm:inline-flex ${
                    scrolled ? "text-[#10261c]" : "text-white"
                  }`}
                >
                  Log in
                </Link>
                <Link
                  href={signUpHref}
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95"
                  style={{ backgroundColor: brand }}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="relative min-h-[100svh] overflow-hidden">
          <Image
            src="/landing/growth.jpg"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(145deg, ${brand}cc 0%, #0a3326e6 55%, #061f18f2 100%)`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

          <div
            className={`relative z-10 mx-auto flex min-h-[100svh] max-w-4xl flex-col items-center justify-center px-4 pb-16 pt-28 text-center text-white transition-all duration-700 sm:px-6 ${
              visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <CompanyBrandAvatar
              logoUrl={company?.logo}
              name={name}
              size="lg"
              className="mb-6 h-20 w-20 rounded-2xl shadow-[0_20px_50px_-24px_rgba(0,0,0,0.65)] ring-1 ring-white/25"
            />
            <p className="font-[family-name:var(--font-landing-display)] text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              {name}
            </p>
            <p className="mt-4 max-w-xl text-base text-white/85 sm:text-lg">
              Apply for services, open apps, and manage your account in one
              customer portal.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {loggedIn ? (
                <Link
                  href={portalHref}
                  className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#10261c] transition hover:bg-white/90"
                >
                  Go to dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href={signUpHref}
                    className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#10261c] transition hover:bg-white/90"
                  >
                    Create account
                  </Link>
                  <Link
                    href={loginHref}
                    className="rounded-xl border border-white/35 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                  >
                    Log in with Green Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        <section id="gallery" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-4 md:grid-cols-3">
            {gallery.map((item, index) => (
              <div
                key={item.src}
                className={`group relative min-h-[220px] overflow-hidden rounded-2xl transition duration-500 ${
                  visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
                style={{ transitionDelay: `${120 + index * 80}ms` }}
              >
                <Image
                  src={item.src}
                  alt=""
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="font-[family-name:var(--font-landing-display)] text-lg font-semibold">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm text-white/80">{item.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="services" className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="grid items-end gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h2 className="font-[family-name:var(--font-landing-display)] text-3xl font-semibold tracking-tight text-[#0B3D2E] sm:text-4xl">
                Services
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-[#4d6358] sm:text-base">
                Programs and forms published by {name} that customers can apply
                for.
              </p>
            </div>
            <div className="relative hidden h-36 overflow-hidden rounded-2xl lg:block">
              <Image
                src="/landing/desk.jpg"
                alt=""
                fill
                className="object-cover"
                sizes="40vw"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(90deg, #f7faf8 0%, ${brand}66 100%)`,
                }}
              />
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {servicesList.length > 0 ? (
              servicesList.map((form: any, index: number) => (
                <Link
                  key={form.id}
                  href={
                    loggedIn
                      ? `/${tenantId}/client/services`
                      : loginHref
                  }
                  className="group rounded-2xl border border-[#d7e4dc] bg-white p-5 transition duration-300 hover:-translate-y-0.5 hover:border-[#b9d0c3] hover:shadow-[0_16px_40px_-28px_rgba(16,38,28,0.45)]"
                  style={{ transitionDelay: `${Math.min(index, 5) * 40}ms` }}
                >
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl text-sm font-semibold text-white"
                    style={{ backgroundColor: brand }}
                  >
                    {String(form.name || "S")
                      .trim()
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <p className="mt-4 font-[family-name:var(--font-landing-display)] text-lg font-semibold text-[#0B3D2E]">
                    {form.name || "Untitled service"}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#54695e]">
                    {form.description ||
                      "Open this service to start or continue an application."}
                  </p>
                  <span
                    className="mt-5 inline-flex items-center gap-1 text-sm font-semibold"
                    style={{ color: brand }}
                  >
                    {loggedIn ? "Apply" : "Sign in to apply"}
                    <FiArrowUpRight className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              ))
            ) : (
              <div className="sm:col-span-2 lg:col-span-3 rounded-2xl border border-dashed border-[#c9d8cf] bg-white/70 px-6 py-12 text-center">
                <p className="font-semibold text-[#0B3D2E]">
                  Services will appear here when published
                </p>
                <p className="mt-2 text-sm text-[#54695e]">
                  Sign up with your Green Account to browse programs and submit
                  applications.
                </p>
              </div>
            )}
          </div>
        </section>

        <section id="apps" className="border-y border-[#d7e4dc] bg-white">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="relative min-h-[260px] overflow-hidden rounded-2xl">
                <Image
                  src="/landing/team.jpg"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(160deg, ${brand}99, #0B3D2Edd)`,
                  }}
                />
                <div className="absolute inset-0 flex items-end p-6 text-white">
                  <div>
                    <p className="font-[family-name:var(--font-landing-display)] text-2xl font-semibold">
                      Apps for your workspace
                    </p>
                    <p className="mt-1 text-sm text-white/85">
                      Tools published for customers of {name}.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="font-[family-name:var(--font-landing-display)] text-3xl font-semibold tracking-tight text-[#0B3D2E] sm:text-4xl">
                  Apps
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-[#4d6358] sm:text-base">
                  Open the tools available through this company&apos;s customer
                  portal.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {apps.map((app) => {
                    const external =
                      app.href.startsWith("http://") ||
                      app.href.startsWith("https://");
                    return (
                      <a
                        key={app.id}
                        href={app.href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noreferrer" : undefined}
                        className="group flex min-h-[200px] flex-col justify-between rounded-2xl border border-[#e3e8e5] bg-[#f7faf8] p-6 transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-28px_rgba(16,38,28,0.4)]"
                      >
                        <div>
                          {app.logoUrl ? (
                            <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-[#e3e8e5] bg-white">
                              <Image
                                src={app.logoUrl}
                                alt=""
                                fill
                                className="object-contain p-1.5"
                                unoptimized
                              />
                            </div>
                          ) : (
                            <div
                              className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg font-semibold text-white ${app.accent}`}
                            >
                              {app.mark}
                            </div>
                          )}
                          <p className="mt-4 font-[family-name:var(--font-landing-display)] text-xl font-semibold text-[#0B3D2E]">
                            {app.name}
                          </p>
                          <p
                            className="mt-1 text-sm font-medium"
                            style={{ color: brand }}
                          >
                            {app.tagline}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-[#54695e]">
                            {app.description}
                          </p>
                        </div>
                        <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[#0B3D2E]">
                          Open
                          <FiArrowUpRight className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      </a>
                    );
                  })}
                  {apps.length === 0 && (
                    <div className="sm:col-span-2 rounded-2xl border border-dashed border-[#c9d8cf] px-6 py-10 text-center text-sm text-[#54695e]">
                      No published apps yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="get-started"
          className="relative overflow-hidden"
          style={{
            background: `linear-gradient(120deg, ${brand}, #0B3D2E)`,
          }}
        >
          <div className="absolute inset-0 opacity-20">
            <Image
              src="/landing/hero.jpg"
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
          <div className="relative mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-4 py-16 text-white sm:flex-row sm:items-center sm:px-6">
            <div>
              <h2 className="font-[family-name:var(--font-landing-display)] text-3xl font-semibold tracking-tight sm:text-4xl">
                Ready to get started?
              </h2>
              <p className="mt-2 max-w-xl text-sm text-white/85 sm:text-base">
                Use your Green Account to sign in as a customer, apply for
                services, and access apps from {name}.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {loggedIn ? (
                <Link
                  href={portalHref}
                  className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#10261c]"
                >
                  Open portal
                </Link>
              ) : (
                <>
                  <Link
                    href={signUpHref}
                    className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#10261c]"
                  >
                    Sign up
                  </Link>
                  <Link
                    href={loginHref}
                    className="rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-white"
                  >
                    Log in
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#d7e4dc] bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-[#54695e] sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-2">
            <CompanyBrandAvatar
              logoUrl={company?.logo}
              name={name}
              size="sm"
              className="h-7 w-7 rounded-md"
            />
            <span>{name}</span>
          </div>
          <p>Customer portal powered by Green Business Suite</p>
        </div>
      </footer>
    </div>
  );
}
