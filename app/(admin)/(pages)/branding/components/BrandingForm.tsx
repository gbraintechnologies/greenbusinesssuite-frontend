"use client";

import React, { useEffect, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import CompanyBrandAvatar from "@/components/CompanyBrand/CompanyBrandAvatar";
import CloudUploadIcon from "@/public/icons/CloudUploadIcon";
import useFileUpload, { extractFileUrl, isPersistableLogoUrl } from "@/hooks/useFileUpload";
import services from "@/services";
import type { CompanyBranding } from "@/types";

type Props = {
  mode: "create" | "edit";
  initial?: CompanyBranding | null;
  /** Required for create — company id from companies API */
  companyId?: string | number;
  tenancyId?: string;
  companyName?: string;
  onSuccess?: () => void;
};

export default function BrandingForm({
  mode,
  initial,
  companyId,
  tenancyId,
  companyName,
  onSuccess,
}: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { handleFileUpload } = useFileUpload();
  const colorPickerRef = useRef<HTMLDivElement>(null);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState(initial?.logo ?? "");
  const [color, setColor] = useState(initial?.color || "#7C3AED");
  const [name, setName] = useState(
    initial?.companyName || companyName || ""
  );
  const [tenant, setTenant] = useState(
    initial?.tenancyId || tenancyId || ""
  );
  const [company, setCompany] = useState<string>(
    String(initial?.companyId ?? companyId ?? "")
  );
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initial) {
      setLogoUrl(initial.logo ?? "");
      setColor(initial.color || "#7C3AED");
      setName(initial.companyName || "");
      setTenant(initial.tenancyId || "");
      setCompany(String(initial.companyId ?? ""));
    }
  }, [initial]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target as Node)
      ) {
        setShowColorPicker(false);
      }
    };
    if (showColorPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showColorPicker]);

  const previewUrl = logoFile ? URL.createObjectURL(logoFile) : logoUrl;

  const resolveLogo = async () => {
    if (logoFile) {
      const uploaded = await handleFileUpload(logoFile);
      const url = extractFileUrl(uploaded);
      if (!url) throw new Error("Logo upload failed");
      setLogoUrl(url);
      setLogoFile(null);
      return url;
    }
    if (isPersistableLogoUrl(logoUrl)) return logoUrl.trim();
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenant.trim() || !company.trim() || !name.trim()) {
      toast.error("Company ID, tenancy ID, and name are required");
      return;
    }

    try {
      setLoading(true);
      const logo = await resolveLogo();
      if (!logo) {
        toast.error("Logo is required");
        return;
      }

      if (mode === "create") {
        await services.createCompanyBranding(
          company,
          tenant.trim(),
          logo,
          color,
          name.trim(),
          [],
          []
        );
        toast.success("Branding created");
      } else {
        if (!initial?.id) {
          toast.error("Missing branding id");
          return;
        }
        await services.editCompanyBranding(
          initial.id,
          company,
          tenant.trim(),
          logo,
          color,
          name.trim(),
          initial.modules?.map((m: any) => m?.id) ??
            initial.moduleIds ??
            [],
          initial.categorySpecificModules?.map((m: any) => m?.id) ??
            initial.categorySpecificModuleIds ??
            []
        );
        toast.success("Branding updated");
      }

      await queryClient.invalidateQueries({ queryKey: ["branding"] });
      await queryClient.invalidateQueries({
        queryKey: ["branding", tenant.trim()],
      });
      if (initial?.id) {
        await queryClient.invalidateQueries({
          queryKey: ["branding-by-id", initial.id],
        });
      }

      onSuccess?.();
      router.push("/branding");
    } catch {
      toast.error(
        mode === "create"
          ? "Failed to create branding"
          : "Failed to update branding"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Company name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400"
          placeholder="Company display name"
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Company ID
          </label>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400"
            placeholder="e.g. 1"
            required
            disabled={mode === "edit"}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Tenancy ID
          </label>
          <input
            value={tenant}
            onChange={(e) => setTenant(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400"
            placeholder="tenant-slug"
            required
            disabled={mode === "edit"}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Logo
        </label>
        <div className="flex items-end gap-4">
          <CompanyBrandAvatar
            logoUrl={previewUrl || null}
            name={name || "Company"}
            size="md"
          />
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">
            <input
              type="file"
              className="hidden"
              accept=".jpg,.jpeg,.png,.webp,.avif"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setLogoFile(file);
              }}
            />
            <CloudUploadIcon />
            {previewUrl ? "Replace logo" : "Upload logo"}
          </label>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Brand color
        </label>
        <button
          type="button"
          onClick={() => setShowColorPicker((v) => !v)}
          className="flex h-9 items-center overflow-hidden rounded-xl border border-slate-200 bg-white text-sm"
        >
          <span
            className="h-full w-8"
            style={{ backgroundColor: color }}
          />
          <span className="px-3 font-medium text-slate-700">{color}</span>
        </button>
        {showColorPicker && (
          <div
            ref={colorPickerRef}
            className="relative z-10 mt-3 w-fit rounded-xl border border-slate-200 bg-white p-4 shadow-lg"
          >
            <HexColorPicker color={color} onChange={setColor} />
            <input
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="mt-3 w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm"
            />
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.push("/branding")}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {loading
            ? "Saving…"
            : mode === "create"
              ? "Create branding"
              : "Save changes"}
        </button>
      </div>
    </form>
  );
}
