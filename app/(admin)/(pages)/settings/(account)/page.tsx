"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FiCamera, FiMail, FiPhone, FiShield } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import services from "@/services";
import useAdmin from "@/hooks/useAdmin";
import useFileUpload, { extractFileUrl } from "@/hooks/useFileUpload";
import { compressImage } from "@/lib/imageCompression";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import DashboardPanel from "@/components/Dashboard/DashboardPanel";
import KpiCard from "@/components/Dashboard/KpiCard";
import TextInput from "../components/TextInput";

const schema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  phone: yup.string().nullable(),
  email: yup.string().email("Enter a valid email").required("Email is required"),
  status: yup.string().nullable(),
});

type FormValues = yup.InferType<typeof schema>;

function pickAvatar(user: any) {
  return (
    user?.custom_profile_values?.find(
      (item: any) => item.custom_profile_item_id === 1
    )?.value ??
    user?.customProfileValues?.find(
      (item: any) =>
        item.custom_profile_item_id === 1 || item.customProfileItemId === 1
    )?.value ??
    ""
  );
}

function normalizeUser(user: any) {
  return {
    id: user?.id,
    firstName: user?.firstName ?? user?.first_name ?? "",
    lastName: user?.lastName ?? user?.last_name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? user?.phone_number ?? "",
    status: user?.status ?? user?.user_status ?? "",
    avatar: pickAvatar(user),
    raw: user,
  };
}

function Account() {
  const { admin, setAdmin, addAdminData } = useAdmin();
  const queryClient = useQueryClient();
  const { handleFileUpload, loadingFile } = useFileUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const { data: meData, isLoading } = useQuery({
    queryKey: ["logged-in-user"],
    queryFn: services.getLoggedInUser(),
  });

  const profile = useMemo(() => {
    const source = meData ?? admin;
    return source ? normalizeUser(source) : null;
  }, [meData, admin]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      status: "",
    },
  });

  useEffect(() => {
    if (!profile) return;
    reset({
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone,
      email: profile.email,
      status: profile.status,
    });
    setAvatarPreview(profile.avatar || "");
    setAvatarFile(null);
  }, [profile, reset]);

  const onPickAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (values: FormValues) => {
    if (!profile?.id) {
      toast.error("Unable to identify your account");
      return;
    }

    try {
      setSaving(true);

      let avatarUrl = profile.avatar;
      if (avatarFile) {
        // Downscale/compress so large phone photos don't get rejected (HTTP 413)
        const optimized = await compressImage(avatarFile, {
          maxSize: 512,
          quality: 0.82,
        });

        // Final guard: if it's still very large the server will reject it
        if (optimized.size > 5 * 1024 * 1024) {
          toast.error(
            "That image is too large. Please choose a photo under 5MB."
          );
          setSaving(false);
          return;
        }

        const uploaded = await handleFileUpload(optimized);
        const uploadedUrl = extractFileUrl(uploaded);
        if (!uploadedUrl) {
          toast.error(
            "Couldn't upload the photo. Please try a smaller image or try again."
          );
          setSaving(false);
          return;
        }
        avatarUrl = uploadedUrl;
      }

      const userData = {
        email: values.email,
        username: values.email,
        first_name: values.firstName,
        last_name: values.lastName,
        phone_number: values.phone || "",
        mobile_phone_number: values.phone || "",
        user_status: values.status || profile.status || "ACTIVE",
      };

      const custom_profiles = [
        {
          custom_profile_item_id: 1,
          value: avatarUrl || "",
        },
      ];

      await services.editUserWithCustomProfiles(
        profile.id,
        userData,
        custom_profiles
      );

      const refreshed = await services.getLoggedInUser()();
      const next = normalizeUser(refreshed);

      // Keep local admin context in sync for top nav / side nav
      setAdmin({
        ...(admin ?? {}),
        ...(refreshed ?? {}),
        id: next.id,
        first_name: next.firstName,
        last_name: next.lastName,
        email: next.email,
        phone_number: next.phone,
        user_status: next.status,
        custom_profile_values: refreshed?.custom_profile_values ?? [
          { custom_profile_item_id: 1, value: avatarUrl },
        ],
      });
      addAdminData?.({
        first_name: next.firstName,
        last_name: next.lastName,
        email: next.email,
      });

      await queryClient.invalidateQueries({ queryKey: ["logged-in-user"] });
      toast.success("Profile updated successfully");
      setAvatarFile(null);
    } catch (error: any) {
      const detail = error?.response?.data?.detail;
      if (Array.isArray(detail)) {
        detail.forEach((item: any) => toast.error(item?.msg || "Update failed"));
      } else {
        toast.error(detail || "Failed to update profile");
      }
    } finally {
      setSaving(false);
    }
  };

  if (isLoading && !profile) {
    return (
      <div className="flex h-64 items-center justify-center">
        <AiOutlineLoading3Quarters
          size={24}
          className="animate-spin text-brand-600"
        />
      </div>
    );
  }

  const initials =
    `${profile?.firstName?.[0] ?? ""}${profile?.lastName?.[0] ?? ""}`.toUpperCase() ||
    "U";

  return (
    <div>
      <DashboardHeader
        title="Settings and Profile Management"
        subtitle="Update your personal details, contact info, and profile photo"
      />

      <div className="mb-5 grid grid-cols-2 gap-2.5 [&>*:last-child:nth-child(odd)]:col-span-2 sm:mb-6 sm:grid-cols-3 sm:gap-4 sm:[&>*:last-child:nth-child(odd)]:col-span-1">
        <KpiCard
          label="Account status"
          value={profile?.status || "—"}
          icon={<FiShield size={18} />}
        />
        <KpiCard
          label="Email"
          value={profile?.email ? "Verified login" : "Missing"}
          icon={<FiMail size={18} />}
          trend={{
            value: profile?.email || "No email",
            direction: "neutral",
          }}
        />
        <KpiCard
          label="Phone"
          value={profile?.phone ? "On file" : "Not set"}
          icon={<FiPhone size={18} />}
        />
      </div>

      <DashboardPanel title="Account details">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <div className="relative">
              {avatarPreview ? (
                <Image
                  alt="Profile"
                  src={avatarPreview}
                  width={96}
                  height={96}
                  className="h-24 w-24 rounded-2xl object-cover ring-4 ring-brand-50"
                  unoptimized
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-brand-50 text-xl font-semibold text-brand-700 ring-4 ring-brand-50">
                  {initials}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white shadow-md transition hover:bg-brand-700"
                aria-label="Change profile photo"
              >
                <FiCamera size={16} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onPickAvatar}
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Profile photo
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Upload a square image for best results. Changes save with the
                form below.
              </p>
              {(avatarFile || loadingFile) && (
                <p className="mt-2 text-xs font-medium text-brand-600">
                  {loadingFile
                    ? "Uploading photo…"
                    : "New photo selected — click Save changes"}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <TextInput
              label="First name"
              placeholder="Enter first name"
              {...register("firstName")}
              error={errors.firstName?.message}
              extraClasses="focus:border-brand-500"
            />
            <TextInput
              label="Last name"
              placeholder="Enter last name"
              {...register("lastName")}
              error={errors.lastName?.message}
              extraClasses="focus:border-brand-500"
            />
            <TextInput
              label="Email address"
              type="email"
              placeholder="Enter email"
              {...register("email")}
              error={errors.email?.message}
              extraClasses="focus:border-brand-500"
            />
            <TextInput
              label="Phone number"
              type="tel"
              placeholder="e.g. 233241234567"
              helperText="Include country code without +"
              {...register("phone")}
              error={errors.phone?.message}
              extraClasses="focus:border-brand-500"
            />
            <TextInput
              label="Status"
              readOnly
              disabled
              {...register("status")}
              helperText="Managed by your organization administrator"
              extraClasses="bg-slate-50 text-slate-500"
            />
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={() => {
                if (!profile) return;
                reset({
                  firstName: profile.firstName,
                  lastName: profile.lastName,
                  phone: profile.phone,
                  email: profile.email,
                  status: profile.status,
                });
                setAvatarPreview(profile.avatar || "");
                setAvatarFile(null);
              }}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={saving || loadingFile || (!isDirty && !avatarFile)}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-brand-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {(saving || loadingFile) && (
                <AiOutlineLoading3Quarters
                  size={16}
                  className="animate-spin"
                />
              )}
              Save changes
            </button>
          </div>
        </form>
      </DashboardPanel>
    </div>
  );
}

export default Account;
