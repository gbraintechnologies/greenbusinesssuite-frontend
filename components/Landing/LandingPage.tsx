"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const heroSlides = [
  {
    badge: "Forms · Programs",
    title: "Turn program applications into real outcomes",
    copy: "Publish loan, grant, and training forms, collect responses, and keep every file on the record.",
    image: "/landing/hero.jpg",
  },
  {
    badge: "Companies · Portals",
    title: "Give every organization its own branded portal",
    copy: "Stand up tenants, assign admins, and open a company workspace without building a separate system.",
    image: "/landing/team.jpg",
  },
  {
    badge: "Clients · Documents",
    title: "Keep clients moving from apply to delivery",
    copy: "Invite people, track status, issue documents, and send notices without leaving the suite.",
    image: "/landing/desk.jpg",
  },
  {
    badge: "Billing · Follow-through",
    title: "Close the loop with bills, invoices, and payments",
    copy: "Create bills, apply discounts, and follow revenue across the same programs your teams already run.",
    image: "/landing/growth.jpg",
  },
] as const;

const valueProps = [
  {
    title: "Every form in one builder",
    copy: "Design multi-section applications for loans, grants, training, and surveys, then publish them to any company.",
  },
  {
    title: "Portals that match the work",
    copy: "Platform admins, company teams, and clients each get a workspace built for their part of the journey.",
  },
  {
    title: "Documents without the chase",
    copy: "Issue files to clients and keep uploads attached to each response so nothing lives in a random inbox.",
  },
  {
    title: "Billing beside the program",
    copy: "Raise bills, track payments, and send updates from the same suite that collected the application.",
  },
] as const;

const modules = [
  { name: "Forms", detail: "Build, publish, and collect program responses." },
  { name: "Companies", detail: "Tenants, branding, admins, and portals." },
  { name: "Clients", detail: "People, profiles, and program history." },
  { name: "Documents", detail: "Issued files and client uploads." },
  { name: "Billing", detail: "Bills, invoices, discounts, and payments." },
  { name: "Notifications", detail: "Email and SMS across the journey." },
] as const;

const workspaces = [
  {
    title: "Platform admin",
    label: "Workspace",
    image: "/landing/desk.jpg",
    detail: "Companies, roles, branding, and global forms",
  },
  {
    title: "Company portal",
    label: "Workspace",
    image: "/landing/team.jpg",
    detail: "Responses, clients, documents, and billing",
  },
  {
    title: "Client workspace",
    label: "Workspace",
    image: "/landing/growth.jpg",
    detail: "Applications, uploads, and issued files",
  },
  {
    title: "Form builder",
    label: "Core tool",
    image: "/landing/hero.jpg",
    detail: "Design, publish, and collect program responses",
  },
] as const;

const faqs = [
  {
    q: "Who is Green Business Suite for?",
    a: "Organizations that run green business programs—loans, grants, training, and enterprise support—and need one system for admins, companies, and clients.",
  },
  {
    q: "What are the three portals?",
    a: "Platform admin configures the suite. Company portals run day-to-day program work. Client workspaces let people apply, upload files, and receive documents.",
  },
  {
    q: "Can each company have its own branding?",
    a: "Yes. Companies can use their own logo, colors, and portal identity while still operating inside the same suite.",
  },
  {
    q: "Does it handle billing and documents?",
    a: "Yes. Teams can issue documents, create bills and invoices, apply discounts, and notify clients without switching tools.",
  },
  {
    q: "How do I get access?",
    a: "Sign in with your platform or company account. If you need a new organization set up, contact your suite administrator.",
  },
] as const;

const menuLinks = [
  { href: "#workspaces", label: "Workspaces" },
  { href: "#features", label: "Features" },
  { href: "#modules", label: "Modules" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#faq", label: "FAQ" },
] as const;

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [slide, setSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSlide((current) => (current + 1) % heroSlides.length);
    }, 5200);
    return () => window.clearInterval(id);
  }, []);

  const active = heroSlides[slide];
  const headerSolid = scrolled || menuOpen;

  return (
    <div className="bg-white text-[#10261c]">
      {/* Autobus-style header: transparent on hero, solid white after scroll / menu */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          headerSolid
            ? "bg-[#f4faf6] text-[#0B3D2E] shadow-[0_10px_30px_-20px_rgba(11,61,46,0.45)]"
            : "bg-transparent text-white"
        }`}
      >
        <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between px-4 sm:h-[4.75rem] sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2.5"
            aria-label="Green Business Suite"
            onClick={() => setMenuOpen(false)}
          >
            <Image
              src="/brand/gbs-mark.png"
              alt=""
              width={40}
              height={40}
              className="h-9 w-9 sm:h-10 sm:w-10"
              priority
              unoptimized
            />
            <span className="font-[family-name:var(--font-landing-display)] text-[15px] font-semibold tracking-tight sm:text-base">
              Green Business Suite
            </span>
          </Link>

          <nav
            aria-label="Primary"
            className={`hidden items-center gap-7 text-sm font-medium md:flex ${
              headerSolid ? "text-[#2f4a3d]" : "text-white/85"
            }`}
          >
            {menuLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`transition ${
                  headerSolid ? "hover:text-[#0B3D2E]" : "hover:text-white"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/auth"
              className="rounded-xl bg-[#1fa35c] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_28px_-12px_rgba(31,163,92,0.9)] transition hover:bg-[#189650]"
            >
              Sign in
            </Link>
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              onClick={() => setMenuOpen((v) => !v)}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition md:hidden ${
                headerSolid
                  ? "border-[#0B3D2E]/12 bg-white text-[#0B3D2E]"
                  : "border-white/25 bg-black/20 text-white"
              }`}
            >
              <span className="relative block h-3.5 w-3.5">
                <span
                  className={`absolute left-0 top-[3px] h-0.5 w-full rounded-full bg-current transition ${
                    menuOpen ? "top-[7px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-[7px] h-0.5 w-full rounded-full bg-current transition ${
                    menuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-[11px] h-0.5 w-full rounded-full bg-current transition ${
                    menuOpen ? "top-[7px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        {/* Mobile menu panel only */}
        <div
          id="site-menu"
          aria-hidden={!menuOpen}
          className={`overflow-hidden border-[#0B3D2E]/08 bg-[#f4faf6] transition-[max-height,opacity,border-color] duration-300 md:hidden ${
            menuOpen
              ? "max-h-[32rem] border-t opacity-100"
              : "pointer-events-none max-h-0 border-t-0 opacity-0"
          }`}
        >
          <nav aria-label="Mobile" className="mx-auto max-w-6xl px-4 py-5">
            <ul className="space-y-1">
              {menuLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="block rounded-xl px-2 py-3 text-lg font-semibold text-[#0B3D2E]"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <Link
              href="/auth"
              className="mt-3 block rounded-xl bg-[#1fa35c] px-4 py-3 text-center text-sm font-semibold text-white"
              onClick={() => setMenuOpen(false)}
            >
              Sign in
            </Link>
          </nav>
        </div>
      </header>

      {menuOpen && (
        <button
          type="button"
          aria-label="Close menu overlay"
          className="fixed inset-0 z-40 bg-black/35 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <main>
        {/* Hero carousel — Autobus channel-style slides */}
        <section className="relative min-h-[100svh] overflow-hidden">
          {heroSlides.map((item, index) => (
            <div
              key={item.title}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === slide ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={item.image}
                alt=""
                fill
                priority={index === 0}
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-black/55" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/25" />
            </div>
          ))}

          <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-4xl flex-col items-center justify-center px-4 pb-16 pt-28 text-center text-white sm:px-6">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1fa35c]" />
              {active.badge}
            </div>
            <h1 className="font-[family-name:var(--font-landing-display)] text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
              {active.title}
            </h1>
            <p className="mt-5 max-w-xl text-base text-white/85 sm:text-lg">
              {active.copy}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/auth"
                className="rounded-xl bg-[#1fa35c] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_-14px_rgba(31,163,92,0.95)] transition hover:bg-[#189650]"
              >
                Sign in
              </Link>
              <a
                href="#features"
                className="rounded-xl border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                See how it works
              </a>
            </div>

            <div className="mt-10 flex gap-2">
              {heroSlides.map((item, index) => (
                <button
                  key={item.badge}
                  type="button"
                  aria-label={`Show slide ${index + 1}`}
                  onClick={() => setSlide(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === slide ? "w-8 bg-white" : "w-2.5 bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Real product workspaces */}
        <section id="workspaces" className="bg-white px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <h2 className="font-[family-name:var(--font-landing-display)] text-3xl font-semibold tracking-tight text-[#0B3D2E] sm:text-4xl">
                Where the work actually happens
              </h2>
              <p className="mt-3 text-base text-[#4a6658] sm:text-lg">
                Green Business Suite is built around the real portals and tools
                your teams use—not generic program labels.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {workspaces.map((item) => (
                <article
                  key={item.title}
                  className="relative h-[22rem] overflow-hidden rounded-3xl sm:h-[24rem]"
                >
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
                  <span className="absolute left-4 top-4 rounded-full bg-[#1fa35c] px-3 py-1 text-xs font-semibold text-white">
                    {item.label}
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="font-[family-name:var(--font-landing-display)] text-xl font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-white/75">{item.detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Value props */}
        <section id="features" className="bg-[#f6faf7] px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {valueProps.map((item) => (
                <div key={item.title}>
                  <h3 className="font-[family-name:var(--font-landing-display)] text-xl font-semibold text-[#0B3D2E]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#4a6658]">
                    {item.copy}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/auth"
                className="rounded-xl bg-[#1fa35c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#189650]"
              >
                Sign in
              </Link>
              <a
                href="#modules"
                className="rounded-xl border border-[#0B3D2E]/15 bg-white px-5 py-3 text-sm font-semibold text-[#0B3D2E] transition hover:border-[#1fa35c]/40"
              >
                See the modules
              </a>
            </div>
          </div>
        </section>

        {/* Whole suite in one place */}
        <section id="modules" className="bg-white px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <h2 className="font-[family-name:var(--font-landing-display)] text-3xl font-semibold tracking-tight text-[#0B3D2E] sm:text-4xl">
                Your whole program stack in one suite
              </h2>
              <p className="mt-3 text-base text-[#4a6658] sm:text-lg">
                Forms, companies, clients, documents, billing, and notifications
                live side by side—on the web, for every role that needs them.
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {modules.map((mod) => (
                <div
                  key={mod.name}
                  className="rounded-2xl border border-[#0B3D2E]/10 bg-[#f7faf8] p-6"
                >
                  <h3 className="font-[family-name:var(--font-landing-display)] text-lg font-semibold text-[#0B3D2E]">
                    {mod.name}
                  </h3>
                  <p className="mt-2 text-sm text-[#4a6658]">{mod.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Portals band */}
        <section className="bg-[#0B3D2E] px-4 py-16 text-white sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <h2 className="font-[family-name:var(--font-landing-display)] text-3xl font-semibold tracking-tight sm:text-4xl">
                Admin, company, and client—same suite
              </h2>
              <p className="mt-3 text-base text-white/75 sm:text-lg">
                Everyone enters through the door that matches their work, while
                the data stays connected underneath.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "Platform admin",
                  copy: "Configure companies, roles, branding, categories, and the forms every tenant uses.",
                },
                {
                  title: "Company portal",
                  copy: "Review responses, manage clients, issue documents, and handle billing day to day.",
                },
                {
                  title: "Client workspace",
                  copy: "Complete forms, upload files, track status, and receive issued documents.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <h3 className="font-[family-name:var(--font-landing-display)] text-xl font-semibold">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">
                    {item.copy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works — 3 steps like Autobus */}
        <section id="how-it-works" className="bg-[#f6faf7] px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <h2 className="font-[family-name:var(--font-landing-display)] text-3xl font-semibold tracking-tight text-[#0B3D2E] sm:text-4xl">
                Live in three clear steps
              </h2>
              <p className="mt-3 text-base text-[#4a6658] sm:text-lg">
                No tangled handoffs. Publish a program, collect from clients,
                then deliver from the same suite.
              </p>
            </div>

            <ol className="mt-12 grid gap-6 lg:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Set up the workspace",
                  copy: "Create the company, branding, and admins. Assign the forms your program needs.",
                },
                {
                  step: "02",
                  title: "Collect applications",
                  copy: "Clients sign in to the portal, complete forms, and upload supporting documents.",
                },
                {
                  step: "03",
                  title: "Review and deliver",
                  copy: "Teams update status, issue documents, send notices, and raise bills when needed.",
                },
              ].map((item) => (
                <li
                  key={item.step}
                  className="rounded-2xl border border-[#0B3D2E]/10 bg-white p-6 sm:p-7"
                >
                  <p className="font-[family-name:var(--font-landing-display)] text-3xl font-semibold text-[#1fa35c]">
                    {item.step}
                  </p>
                  <h3 className="mt-4 text-xl font-semibold text-[#0B3D2E]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#4a6658]">
                    {item.copy}
                  </p>
                </li>
              ))}
            </ol>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/auth"
                className="rounded-xl bg-[#1fa35c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#189650]"
              >
                Sign in
              </Link>
              <a
                href="#faq"
                className="rounded-xl border border-[#0B3D2E]/15 bg-white px-5 py-3 text-sm font-semibold text-[#0B3D2E]"
              >
                Read the FAQ
              </a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="bg-white px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center font-[family-name:var(--font-landing-display)] text-3xl font-semibold tracking-tight text-[#0B3D2E] sm:text-4xl">
              Questions teams ask us
            </h2>
            <div className="mt-10 divide-y divide-[#0B3D2E]/10 border-y border-[#0B3D2E]/10">
              {faqs.map((item, index) => {
                const open = openFaq === index;
                return (
                  <div key={item.q}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-4 py-5 text-left"
                      aria-expanded={open}
                      onClick={() => setOpenFaq(open ? -1 : index)}
                    >
                      <span className="font-semibold text-[#0B3D2E]">
                        {item.q}
                      </span>
                      <span
                        className={`text-xl text-[#1fa35c] transition ${
                          open ? "rotate-45" : ""
                        }`}
                      >
                        +
                      </span>
                    </button>
                    {open && (
                      <p className="pb-5 text-sm leading-relaxed text-[#4a6658]">
                        {item.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-[#0B3D2E] px-4 py-16 text-white sm:px-6 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-[family-name:var(--font-landing-display)] text-3xl font-semibold tracking-tight sm:text-4xl">
              Let the suite handle the next program cycle
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-white/75">
              Sign in to manage companies, forms, clients, documents, and billing
              from one Green Business Suite.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/auth"
                className="rounded-xl bg-[#1fa35c] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#189650]"
              >
                Sign in
              </Link>
              <a
                href="#workspaces"
                className="rounded-xl border border-white/35 px-6 py-3 text-sm font-semibold transition hover:bg-white/10"
              >
                See workspaces
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Autobus-style rich footer */}
      <footer className="bg-[#071f17] text-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div className="md:col-span-2 lg:col-span-1">
              <Link href="/" className="inline-flex items-center gap-2.5">
                <Image
                  src="/brand/gbs-mark.png"
                  alt="Green Business Suite"
                  width={36}
                  height={36}
                  className="h-9 w-9"
                  unoptimized
                />
                <span className="font-[family-name:var(--font-landing-display)] text-sm font-semibold">
                  Green Business Suite
                </span>
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
                Operate green business programs end to end—forms, portals,
                clients, documents, and billing in one suite.
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9fd4b3]">
                Product
              </p>
              <ul className="mt-4 space-y-3 text-sm text-white/70">
                <li>
                  <a href="#features" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#modules" className="hover:text-white">
                    Modules
                  </a>
                </li>
                <li>
                  <a href="#workspaces" className="hover:text-white">
                    Workspaces
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-white">
                    How it works
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-white">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9fd4b3]">
                Account
              </p>
              <ul className="mt-4 space-y-3 text-sm text-white/70">
                <li>
                  <Link href="/auth" className="hover:text-white">
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link href="/auth/forgot-password" className="hover:text-white">
                    Forgot password
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9fd4b3]">
                Workspaces
              </p>
              <ul className="mt-4 space-y-3 text-sm text-white/70">
                <li>Platform admin</li>
                <li>Company portal</li>
                <li>Client workspace</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-8 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Green Business Suite. All rights reserved.</p>
            <p>Built for teams who deliver green enterprise programs.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
