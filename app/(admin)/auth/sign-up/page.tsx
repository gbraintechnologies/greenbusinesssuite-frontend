"use client";

import React, { useState } from "react";
import TextInput from "../(login)/components/TextInput";
import PasswordInput from "../(login)/components/PasswordInput";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiAlertCircle } from "react-icons/fi";
import { apexSignUp } from "@/services/features/authService";
import { toast } from "sonner";
import { Button } from "@heroui/react";

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

export default function SignUpPage() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

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
      await apexSignUp({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });
      toast.success("Account created. You can sign in now.");
      router.push("/auth");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Could not create account. Try again.";
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
            Green Business Suite
          </span>
        </Link>

        <div className="mx-auto w-full max-w-md py-10 sm:py-14">
          <h1 className="font-[family-name:var(--font-landing-display)] text-3xl font-semibold tracking-tight text-[#0B3D2E] sm:text-4xl">
            Create account
          </h1>
          <p className="mt-2 text-sm text-[#4a6658] sm:text-base">
            Register to access Green Business Suite.
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
              Create account
            </Button>
          </form>

          <p className="mt-8 text-sm text-[#4a6658]">
            Already have an account?{" "}
            <Link
              href="/auth"
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
        <div className="absolute inset-0 bg-[#0B3D2E]/78" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D2E] via-[#0B3D2E]/45 to-transparent" />

        <div className="relative z-10 flex h-full flex-col justify-end p-10 xl:p-14">
          <div className="max-w-lg text-white">
            <p className="font-[family-name:var(--font-landing-display)] text-3xl font-semibold leading-tight tracking-tight xl:text-4xl">
              Join the suite your programs run on
            </p>
            <p className="mt-4 text-base leading-relaxed text-white/80">
              Create your account to access forms, portals, clients, documents,
              and billing in one place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
