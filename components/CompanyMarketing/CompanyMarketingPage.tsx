"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { FiArrowUpRight } from "react-icons/fi";
import services from "@/services";
import useCompany from "@/hooks/useCompany";
import useAuth from "@/hooks/useAuth";
import useUser from "@/hooks/useUser";
import CompanyBrandAvatar from "@/components/CompanyBrand/CompanyBrandAvatar";
import { publishedSuiteProducts } from "@/lib/suiteProducts";

function formList(payload: any) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;
  return [];
}

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
  const name = company?.name || "Company";
  const loggedIn = Boolean(auth?.access_token && user);

  const companyId =
    company?.companyId ?? company?.company_id ?? company?.id ?? null;

  const { data: formsPayload } = useQuery({
    queryKey: ["marketing company forms", companyId],
    queryFn: services.getFormsByCompanyId(String(companyId), 0, 24, "ALL"),
    enabled: Boolean(companyId),
    retry: 0,
  });

  const servicesList = useMemo(() => {
    return formList(formsPayload)
      .filter(
        (form: any) =>
          String(form?.publishStatus ?? "").toUpperCase() === "PUBLISHED"
      )
      .slice(0, 8);
  }, [formsPayload]);

  const apps = useMemo(() => publishedSuiteProducts(), []);

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

  const loginHref = `/${tenantId}/auth/login`;
  const signUpHref = `/${tenantId}/auth/sign-up`;
  const portalHref = `/${tenantId}/client/dashboard`;

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
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(145deg, ${brand} 0%, #0a3326 48%, #061f18 100%)`,
            }}
          />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle at 18% 22%, rgba(255,255,255,0.22), transparent 42%), radial-gradient(circle at 82% 18%, rgba(255,255,255,0.12), transparent 36%), linear-gradient(to top, rgba(0,0,0,0.45), transparent 55%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />

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
                    Log in
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        <section id="services" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div
            className={`transition-all delay-100 duration-700 ${
              visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            <h2 className="font-[family-name:var(--font-landing-display)] text-3xl font-semibold tracking-tight text-[#0B3D2E] sm:text-4xl">
              Services
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[#4d6358] sm:text-base">
              Programs and forms published by {name} that customers can apply
              for.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {servicesList.length > 0 ? (
              servicesList.map((form: any, index: number) => (
                <Link
                  key={form.id}
                  href={
                    loggedIn
                      ? `/${tenantId}/client/services`
                      : `${loginHref}?redirect=1&f=${form.id}&c=${companyId ?? ""}`
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
                  Sign up to browse available programs and submit applications.
                </p>
              </div>
            )}
          </div>
        </section>

        <section
          id="apps"
          className="border-y border-[#d7e4dc] bg-white"
        >
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <h2 className="font-[family-name:var(--font-landing-display)] text-3xl font-semibold tracking-tight text-[#0B3D2E] sm:text-4xl">
              Apps
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[#4d6358] sm:text-base">
              Tools available through {name}&apos;s customer workspace.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
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
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg font-semibold text-white ${app.accent}`}
                      >
                        {app.mark}
                      </div>
                      <p className="mt-4 font-[family-name:var(--font-landing-display)] text-xl font-semibold text-[#0B3D2E]">
                        {app.name}
                      </p>
                      <p className="mt-1 text-sm font-medium" style={{ color: brand }}>
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
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-4 py-16 text-white sm:flex-row sm:items-center sm:px-6">
            <div>
              <h2 className="font-[family-name:var(--font-landing-display)] text-3xl font-semibold tracking-tight sm:text-4xl">
                Ready to get started?
              </h2>
              <p className="mt-2 max-w-xl text-sm text-white/85 sm:text-base">
                Create a customer account to apply for services, track
                applications, and access apps from {name}.
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
