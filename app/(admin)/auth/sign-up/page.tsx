"use client";

import React, { Suspense, useMemo, useState } from "react";
import TextInput from "../(login)/components/TextInput";
import PasswordInput from "../(login)/components/PasswordInput";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { FiAlertCircle, FiArrowUpRight } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { userSelfSignUp } from "@/services/features/authService";
import services from "@/services";
import { toast } from "sonner";
import { Button } from "@heroui/react";
import type { SuiteProduct } from "@/lib/suiteProducts";

const schema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup
    .string()
    .min(4, "Password must be at least 4 characters")
    .required("Password is required"),
});

type FormValues = yup.InferType<typeof schema>;

function AppShowcaseCard({ app }: { app: SuiteProduct }) {
  const external =
    app.href.startsWith("http://") || app.href.startsWith("https://");

  return (
    <a
      href={app.href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="group flex gap-4 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm transition hover:bg-white/15"
    >
      {app.logoUrl ? (
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white">
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
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-semibold text-white ${app.accent}`}
        >
          {app.mark}
        </div>
      )}
      <div className="min-w-0">
        <p className="font-semibold text-white">{app.name}</p>
        <p className="mt-0.5 text-sm text-white/75">{app.tagline}</p>
        <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#9AE6B4]">
          Try {app.name}
          <FiArrowUpRight className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </a>
  );
}

function GreenAccountSignUpForm() {
  const router = useRouter();
  const search = useSearchParams();
  const redirectTo = search.get("redirect");
  const fromTenant = search.get("from");
  const [formError, setFormError] = useState<string | null>(null);

  const signInHref = useMemo(() => {
    const params = new URLSearchParams();
    if (redirectTo) params.set("redirect", redirectTo);
    if (fromTenant) params.set("from", fromTenant);
    const qs = params.toString();
    return qs ? `/auth?${qs}` : "/auth";
  }, [redirectTo, fromTenant]);

  const { data: apps = [] } = useQuery({
    queryKey: ["published suite apps signup"],
    queryFn: services.listPublishedSuiteApps,
    staleTime: 60_000,
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setFormError(null);
      await userSelfSignUp({
        username: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        companyIdentifier: fromTenant || undefined,
      });
      toast.success(
        "Green Account created. Check your email to activate, then sign in."
      );
      router.push(signInHref);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Could not create your Green Account. Try again.";
      setFormError(String(message));
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f4faf6] text-[#10261c]">
      <div className="flex w-full flex-col justify-between px-5 py-6 sm:px-8 lg:w-[46%] lg:px-12 xl:px-16">
        <Link href="/" className="inline-flex items-center gap-2.5 self-start">
          <Image
            src="/brand/gbs-mark.png"
            alt="Green Business Suite"
            width={40}
            height={40}
            className="h-10 w-10"
            priority
            unoptimized
          />
          <span className="font-[family-name:var(--font-landing-display)] text-sm font-semibold tracking-tight text-[#0B3D2E] sm:text-[15px]">
            Green Account
          </span>
        </Link>

        <div className="mx-auto w-full max-w-md py-10 sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1fa35c]">
            For customers &amp; business owners
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-landing-display)] text-3xl font-semibold tracking-tight text-[#0B3D2E] sm:text-4xl">
            Create your Green Account
          </h1>
          <p className="mt-2 text-sm text-[#4a6658] sm:text-base">
            One account to apply for company services, open suite apps, and
            manage your business across Green Business Suite.
          </p>

          <form
            className="mt-8 flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <TextInput
                label="First name"
                type="text"
                placeholder="First name"
                autoComplete="given-name"
                {...register("firstName")}
                error={errors.firstName?.message}
                extraClasses={
                  errors.firstName
                    ? "border-red-500"
                    : "border-[#0B3D2E]/15 focus:border-[#1fa35c]"
                }
              />
              <TextInput
                label="Last name"
                type="text"
                placeholder="Last name"
                autoComplete="family-name"
                {...register("lastName")}
                error={errors.lastName?.message}
                extraClasses={
                  errors.lastName
                    ? "border-red-500"
                    : "border-[#0B3D2E]/15 focus:border-[#1fa35c]"
                }
              />
            </div>

            <TextInput
              label="Email address"
              type="email"
              placeholder="Enter your email address"
              autoComplete="email"
              {...register("email")}
              error={errors.email?.message}
              extraClasses={
                errors.email
                  ? "border-red-500"
                  : "border-[#0B3D2E]/15 focus:border-[#1fa35c]"
              }
            />

            <div>
              <PasswordInput
                label="Password"
                placeholder="Create a password"
                autoComplete="new-password"
                {...register("password")}
                error={errors.password?.message}
                extraClasses={
                  errors.password
                    ? "border-red-500"
                    : "border-[#0B3D2E]/15 focus:border-[#1fa35c]"
                }
              />
              {formError && (
                <div className="mt-2 flex items-center gap-2">
                  <FiAlertCircle className="shrink-0 text-red-500" size={16} />
                  <p className="text-sm text-red-600">{formError}</p>
                </div>
              )}
            </div>

            <Button
              className="h-12 rounded-xl bg-[#1fa35c] text-sm font-semibold text-white shadow-[0_12px_28px_-14px_rgba(31,163,92,0.9)] transition hover:bg-[#189650]"
              type="submit"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Create Green Account
            </Button>
          </form>

          <p className="mt-6 text-xs leading-5 text-[#6b8576]">
            Platform admins and company admins are invited by email — they do
            not self-register here.
          </p>

          <p className="mt-6 text-sm text-[#4a6658]">
            Already have a Green Account?{" "}
            <Link
              href={signInHref}
              className="font-semibold text-[#0B7A43] hover:text-[#096637]"
            >
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-xs text-[#6b8576]">
          © {new Date().getFullYear()} Green Business Suite
        </p>
      </div>

      <div className="relative hidden overflow-hidden lg:block lg:w-[54%]">
        <Image
          src="/landing/team.jpg"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="54vw"
        />
        <div className="absolute inset-0 bg-[#0B3D2E]/82" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D2E] via-[#0B3D2E]/55 to-transparent" />

        <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-14">
          <div className="max-w-lg text-white">
            <p className="font-[family-name:var(--font-landing-display)] text-3xl font-semibold leading-tight tracking-tight xl:text-4xl">
              Your Green Account opens the suite
            </p>
            <p className="mt-4 text-base leading-relaxed text-white/80">
              Apply for company programs, track applications, and try the apps
              we build for growing businesses.
            </p>
          </div>

          <div className="mt-10 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
              Explore our apps
            </p>
            {apps.length > 0 ? (
              apps.slice(0, 4).map((app) => (
                <AppShowcaseCard key={app.id} app={app} />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/25 px-4 py-8 text-sm text-white/70">
                Published apps will appear here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GreenAccountSignUpPage() {
  return (
    <Suspense fallback={null}>
      <GreenAccountSignUpForm />
    </Suspense>
  );
}
