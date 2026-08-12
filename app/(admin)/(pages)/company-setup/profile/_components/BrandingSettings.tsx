"use client";

import Loader from "@/components/Loader/Loader";
import { extractFileUrl, isPersistableLogoUrl } from "@/hooks/useFileUpload";
import CompanyBrandAvatar from "@/components/CompanyBrand/CompanyBrandAvatar";
import CloudUploadIcon from "@/public/icons/CloudUploadIcon";
import services from "@/services";
import { Button } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import React, { useRef, useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { toast } from "sonner";

const BrandingSettings = ({
  brandingLoading,
  companySmallLogo,
  setCompanySmallLogo,
  smallLogoUrl,
  setSmallLogoUrl,
  color,
  showColorPicker,
  setShowColorPicker,
  handleChangeComplete,
  companyBranding,
  companyData,
}: {
  brandingLoading: boolean;
  companySmallLogo: any;
  smallLogoUrl: string;
  setCompanySmallLogo: any;
  setSmallLogoUrl?: any;
  color: string;
  showColorPicker: boolean;
  setShowColorPicker: any;
  handleChangeComplete: any;
  companyBranding: any;
  companyData: any;
}) => {
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showColorPicker, setShowColorPicker]);

  const [loading, setLoading] = useState(false);

  const tenancyId =
    companyData?.companyIdentifier ?? companyData?.company_identifier;
  const companyId =
    companyData?.companyId ?? companyData?.company_id ?? companyData?.id;
  const companyName =
    companyData?.companyName ?? companyData?.company_name ?? "";

  const invalidateBranding = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["branding"] }),
      queryClient.invalidateQueries({
        queryKey: ["get company branding info", tenancyId],
      }),
      queryClient.invalidateQueries({ queryKey: ["branding", tenancyId] }),
      queryClient.invalidateQueries({
        queryKey: ["branding-by-company", companyId],
      }),
    ]);
  };

  const uploadLogoIfNeeded = async () => {
    if (!companySmallLogo) {
      if (isPersistableLogoUrl(smallLogoUrl)) return smallLogoUrl.trim();
      if (isPersistableLogoUrl(companyBranding?.logo)) {
        return companyBranding.logo.trim();
      }
      return "";
    }

    const uploaded = await services.uploadBrandingLogo({
      companyId,
      tenancyId,
      file: companySmallLogo as File,
    });
    const url = extractFileUrl(uploaded);
    setCompanySmallLogo(null);
    if (url) {
      setSmallLogoUrl?.(url);
      return url;
    }
    // Dedicated logo endpoint stored the file; don't overwrite with a blank URL.
    if (isPersistableLogoUrl(smallLogoUrl)) return smallLogoUrl.trim();
    if (isPersistableLogoUrl(companyBranding?.logo)) {
      return companyBranding.logo.trim();
    }
    return "";
  };

  const createBranding = async () => {
    try {
      setLoading(true);
      if (!companyId || !tenancyId) {
        toast.error("Company details are required");
        return;
      }

      const logoUrl = await uploadLogoIfNeeded();

      await services.createCompanyBranding(
        companyId,
        tenancyId,
        logoUrl || "",
        color,
        companyName,
        [],
        []
      );

      await invalidateBranding();
      toast.success("Branding saved successfully");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.detail ||
          error?.response?.data?.message ||
          error?.message ||
          "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const editCompanyBranding = async () => {
    try {
      setLoading(true);
      const logoUrl = await uploadLogoIfNeeded();

      await services.editCompanyBranding(
        companyBranding?.id ?? companyBranding?.companyId ?? companyId,
        companyId,
        tenancyId,
        logoUrl || companyBranding?.logo || "",
        color,
        companyName,
        companyBranding?.modules?.map((module: any) => module?.id) ?? [],
        companyBranding?.categorySpecificModules?.map(
          (module: any) => module?.id
        ) ?? []
      );
      await invalidateBranding();
      toast.success("Company branding updated successfully");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.detail ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update company branding"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveLogo = async () => {
    try {
      setLoading(true);
      await services.deleteBrandingLogo({ companyId, tenancyId });
      setCompanySmallLogo(null);
      setSmallLogoUrl?.("");
      await invalidateBranding();
      toast.success("Logo removed");
    } catch {
      toast.error("Failed to remove logo");
    } finally {
      setLoading(false);
    }
  };

  const previewUrl = companySmallLogo
    ? URL.createObjectURL(companySmallLogo)
    : smallLogoUrl;

  return (
    <div>
      {brandingLoading ? (
        <Loader text="Fetching company branding information" />
      ) : (
        <div className="pt-6">
          <header className="flex w-full items-center justify-between pb-3">
            <div>
              <h3 className="text-lg font-semibold text-primary-dark">
                Branding Settings
              </h3>
              <p className="text-sm text-[#667085]">
                Set your default branding elements to control the appearance of
                the company dashboard to users.
              </p>
            </div>
            <Button
              color="primary"
              className="bg-brand-600 px-10"
              isLoading={loading}
              isDisabled={loading}
              onPress={() => {
                if (companyBranding == undefined || companyBranding == null) {
                  createBranding();
                } else {
                  editCompanyBranding();
                }
              }}
            >
              Save
            </Button>
          </header>

          <div className="max-w-2xl">
            <div className="mb-4 mt-2">
              <h2 className="text-base font-medium text-primary-dark">
                Upload small icon
              </h2>
              <p className="text-sm text-[#667085]">
                A smaller representation of your logo to be used as a favicon.
                It must be squared and at least 128px by 128px with a max size
                of 512KB. Supported formats are JPG and PNG only.
              </p>

              <div className="my-3 flex flex-wrap items-end gap-4">
                {!previewUrl && (
                  <CompanyBrandAvatar
                    logoUrl={null}
                    name={companyName}
                    size="md"
                  />
                )}

                <label className="mt-2 flex h-fit w-fit cursor-pointer items-center gap-2 rounded-md border border-[#E2E8F0] bg-white p-2 text-sm font-medium text-[#334155]">
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      setCompanySmallLogo(file);
                    }}
                    accept=".jpg, .png, .avif, .jpeg, .webp"
                  />
                  <CloudUploadIcon />
                  <p>{previewUrl ? "Replace" : "Upload"}</p>
                </label>

                {previewUrl && (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleRemoveLogo}
                    className="rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                  >
                    Remove
                  </button>
                )}
              </div>

              {previewUrl && (
                <div
                  className="my-3 flex h-32 w-32 items-center justify-center overflow-hidden rounded-md border border-[#E2E8F0] bg-white"
                  style={{
                    backgroundImage: `url(${previewUrl})`,
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                  }}
                />
              )}
            </div>

            <div className="input-holder">
              <h2 className="text-base font-medium text-primary-dark">
                Company Color
              </h2>
              <p className="text-sm text-[#667085]">
                Add a splash of color to your pages
              </p>

              <button
                className="my-2 mt-2 flex h-8 w-fit cursor-pointer items-center rounded-md border border-[#E2E8F0] bg-white text-sm font-medium text-[#334155]"
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
              >
                <div
                  className="h-8 w-5 rounded-bl-md rounded-tl-md"
                  style={{ backgroundColor: color || "#7C3AED" }}
                />
                <p className="p-2">{color || "Select"}</p>
              </button>

              {showColorPicker && (
                <div className="relative mt-4">
                  <div
                    ref={colorPickerRef}
                    className="absolute z-10 rounded-lg border border-[#E2E8F0] bg-white p-4 shadow-lg"
                  >
                    <HexColorPicker
                      color={color || "#7C3AED"}
                      onChange={(newColor) =>
                        handleChangeComplete({ hex: newColor })
                      }
                    />
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <input
                        type="text"
                        value={color ?? ""}
                        onChange={(e) =>
                          handleChangeComplete({ hex: e.target.value })
                        }
                        className="w-32 rounded-md border border-[#E2E8F0] px-3 py-2 text-sm"
                        placeholder="#7C3AED"
                      />
                      <button
                        type="button"
                        onClick={() => setShowColorPicker(false)}
                        className="rounded-md bg-brand-600 px-4 py-2 text-sm text-white hover:bg-brand-700"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandingSettings;
