"use client";

import React, { useEffect, useState } from "react";
import TextInput from "./components/TextInput";
import PasswordInput from "./components/PasswordInput";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiAlertCircle } from "react-icons/fi";
import { login } from "@/services/features/authService";
import useAdmin from "@/hooks/useAdmin";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import useUser from "@/hooks/useUser";
import { Button } from "@heroui/react";
import { isPlatformAdmin } from "@/lib/platformRole";

const schema = yup.object({
  username: yup.string().required("Email is required"),
  password: yup
    .string()
    .min(4, "Password must be at least 4 characters")
    .required("Password is required"),
});

function LogIn() {
  const router = useRouter();

  const { admin, removeAdmin, addAdminData, hasHydrated: adminHydrated } =
    useAdmin();
  const { auth, addAuthData, hasHydrated: authHydrated } = useAuth();
  const { removeUser, addUserData } = useUser();

  useEffect(() => {
    if (!authHydrated || !adminHydrated) return;
    const accessToken = auth?.accessToken ?? auth?.access_token;
    if (!accessToken) return;
    router.replace(isPlatformAdmin(admin ?? auth) ? "/dashboard" : "/client");
  }, [authHydrated, adminHydrated, admin, auth, router]);

  const [loginError, setLoginError] = useState<string | null>(null);

  type typeOfSchema = yup.InferType<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<typeOfSchema>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: typeOfSchema) => {
    try {
      setLoginError(null);
      const token: any = await login({
        username: data.username,
        password: data.password,
      });

      if (token?.status === 200) {
        addAuthData(token?.data);
        toast.success("Logged in");
        if (isPlatformAdmin(token?.data)) {
          addAdminData(token?.data);
          removeUser();
          router.push("/dashboard");
        } else {
          removeAdmin();
          addUserData(token?.data);
          router.push("/client");
        }
      }
    } catch (error) {
      setLoginError("Incorrect email address or password");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f4faf6] text-[#10261c]">
      {/* Form panel */}
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
            Green Business Suite
          </span>
        </Link>

        <div className="mx-auto w-full max-w-md py-10 sm:py-14">
          <h1 className="font-[family-name:var(--font-landing-display)] text-3xl font-semibold tracking-tight text-[#0B3D2E] sm:text-4xl">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-[#4a6658] sm:text-base">
            Sign in to continue to your workspace.
          </p>

          <form
            className="mt-8 flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <TextInput
              label="Email address"
              type="text"
              placeholder="Enter your email address"
              autoComplete="username"
              {...register("username")}
              error={errors.username?.message}
              extraClasses={
                errors.username
                  ? "border-red-500"
                  : "border-[#0B3D2E]/15 focus:border-[#1fa35c]"
              }
            />

            <div>
              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                autoComplete="current-password"
                {...register("password")}
                error={errors.password?.message}
                extraClasses={
                  errors.password
                    ? "border-red-500"
                    : "border-[#0B3D2E]/15 focus:border-[#1fa35c]"
                }
              />
              {loginError && (
                <div className="mt-2 flex items-center gap-2">
                  <FiAlertCircle className="shrink-0 text-red-500" size={16} />
                  <p className="text-sm text-red-600">{loginError}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Link
                href="/auth/forgot-password"
                className="text-sm font-semibold text-[#0B7A43] transition hover:text-[#096637]"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              className="h-12 rounded-xl bg-[#1fa35c] text-sm font-semibold text-white shadow-[0_12px_28px_-14px_rgba(31,163,92,0.9)] transition hover:bg-[#189650]"
              type="submit"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Sign in
            </Button>
          </form>

          <p className="mt-8 text-sm text-[#4a6658]">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/sign-up"
              className="font-semibold text-[#0B7A43] hover:text-[#096637]"
            >
              Create account
            </Link>
          </p>
          <p className="mt-3 text-sm text-[#4a6658]">
            Looking for the public site?{" "}
            <Link
              href="/"
              className="font-semibold text-[#0B7A43] hover:text-[#096637]"
            >
              Back to home
            </Link>
          </p>
        </div>

        <p className="text-xs text-[#6b8576]">
          © {new Date().getFullYear()} Green Business Suite
        </p>
      </div>

      {/* Brand panel */}
      <div className="relative hidden overflow-hidden lg:block lg:w-[54%]">
        <Image
          src="/landing/hero.jpg"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="54vw"
        />
        <div className="absolute inset-0 bg-[#0B3D2E]/78" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D2E] via-[#0B3D2E]/45 to-transparent" />

        <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-14">
          <Image
            src="/brand/gbs-mark.png"
            alt=""
            width={56}
            height={56}
            className="h-14 w-14"
            unoptimized
          />

          <div className="max-w-lg text-white">
            <p className="font-[family-name:var(--font-landing-display)] text-3xl font-semibold leading-tight tracking-tight xl:text-4xl">
              Operate green business programs from one suite
            </p>
            <p className="mt-4 text-base leading-relaxed text-white/80">
              Forms, company portals, clients, documents, and billing—connected
              for platform admins, company teams, and clients.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {["Platform admin", "Company portal", "Client workspace"].map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-white/15 bg-white/10 px-3 py-3 text-sm font-medium backdrop-blur-sm"
                  >
                    {item}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogIn;
