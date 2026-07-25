"use client";

import React, { useMemo } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FaRegCheckCircle } from "react-icons/fa";
import { FiLock, FiShield } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { changePassword } from "@/services/features/authService";
import useAdmin from "@/hooks/useAdmin";
import useAuth from "@/hooks/useAuth";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import DashboardPanel from "@/components/Dashboard/DashboardPanel";
import KpiCard from "@/components/Dashboard/KpiCard";
import PasswordInput from "../components/PasswordInput";

const schema = yup.object({
  current_password: yup.string().required("Current password is required"),
  new_password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("new_password")], "Passwords do not match")
    .required("Confirm your new password"),
});

type FormValues = yup.InferType<typeof schema>;

function Security() {
  const { admin } = useAdmin();
  const { removeAuth } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const newPassword = watch("new_password") || "";

  const checks = useMemo(
    () => [
      {
        label: "At least 6 characters",
        ok: newPassword.length >= 6,
      },
      {
        label: "Contains a number",
        ok: /\d/.test(newPassword),
      },
      {
        label: "Contains a letter",
        ok: /[A-Za-z]/.test(newPassword),
      },
    ],
    [newPassword]
  );

  const onSubmit = async (data: FormValues) => {
    try {
      await changePassword({
        currentPassword: data.current_password,
        newPassword: data.new_password,
        confirmPassword: data.confirm_password,
      });

      toast.success("Password changed successfully. Please sign in again.");
      reset();
      removeAuth();
      // Soft redirect after token clear
      window.location.href = "/";
    } catch (error: any) {
      const detail = error?.response?.data?.detail;
      if (Array.isArray(detail)) {
        detail.forEach((item: any) =>
          toast.error(item?.msg || "Password change failed")
        );
      } else {
        toast.error(detail || "Failed to change password");
      }
    }
  };

  return (
    <div>
      <DashboardHeader
        title="Security"
        subtitle="Protect your account by updating your password regularly"
      />

      <div className="mb-5 grid grid-cols-2 gap-2.5 sm:mb-6 sm:gap-4">
        <KpiCard
          label="Signed in as"
          value={admin?.email || "—"}
          icon={<FiShield size={18} />}
        />
        <KpiCard
          label="Password policy"
          value="6+ characters"
          icon={<FiLock size={18} />}
          trend={{ value: "Minimum requirement", direction: "neutral" }}
        />
      </div>

      <DashboardPanel title="Change password">
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-5">
          <PasswordInput
            label="Current password"
            placeholder="Enter your current password"
            {...register("current_password")}
            error={errors.current_password?.message}
            extraClasses="focus:border-brand-500"
          />
          <PasswordInput
            label="New password"
            placeholder="Enter a new password"
            {...register("new_password")}
            error={errors.new_password?.message}
            extraClasses="focus:border-brand-500"
          />
          <PasswordInput
            label="Confirm new password"
            placeholder="Re-enter your new password"
            {...register("confirm_password")}
            error={errors.confirm_password?.message}
            extraClasses="focus:border-brand-500"
          />

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="mb-2 text-sm font-medium text-slate-700">
              Password requirements
            </p>
            <ul className="space-y-1.5">
              {checks.map((check) => (
                <li
                  key={check.label}
                  className={`flex items-center gap-2 text-sm ${
                    check.ok ? "text-emerald-600" : "text-slate-500"
                  }`}
                >
                  <FaRegCheckCircle size={14} />
                  {check.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end border-t border-slate-100 pt-5">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-brand-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting && (
                <AiOutlineLoading3Quarters
                  size={16}
                  className="animate-spin"
                />
              )}
              Update password
            </button>
          </div>
        </form>
      </DashboardPanel>
    </div>
  );
}

export default Security;
