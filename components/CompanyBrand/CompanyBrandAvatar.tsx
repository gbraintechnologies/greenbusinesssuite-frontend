"use client";

import Image from "next/image";
import clsx from "clsx";
import { useState } from "react";
import MeshSuiteMark from "@/public/icons/MeshSuiteMark";
import { isDisplayableLogoUrl } from "@/hooks/useFileUpload";

const sizeMap = {
  xs: "h-8 w-8 text-[10px] rounded-lg",
  sm: "h-10 w-10 text-xs rounded-xl",
  md: "h-14 w-14 text-sm rounded-2xl",
  lg: "h-24 w-24 text-2xl rounded-2xl",
  xl: "h-36 w-36 text-4xl rounded-3xl",
};

type Props = {
  logoUrl?: string | null;
  name?: string;
  size?: keyof typeof sizeMap;
  className?: string;
  shape?: "squircle" | "circle";
};

function getInitials(name?: string) {
  return (
    name
      ?.split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "—"
  );
}

export function MeshSuiteLogoMark({ className }: { className?: string }) {
  return <MeshSuiteMark className={clsx("h-5 w-5", className)} color="#FFFFFF" />;
}

export default function CompanyBrandAvatar({
  logoUrl,
  name,
  size = "sm",
  className,
  shape = "squircle",
}: Props) {
  const [imgFailed, setImgFailed] = useState(false);
  const sizeClass = sizeMap[size];
  const shapeClass = shape === "circle" ? "!rounded-full" : "";
  const showImage = isDisplayableLogoUrl(logoUrl) && !imgFailed;

  if (showImage) {
    return (
      <div
        className={clsx(
          "relative shrink-0 overflow-hidden border border-slate-200 bg-white shadow-sm",
          sizeClass,
          shapeClass,
          className
        )}
      >
        <Image
          src={logoUrl!}
          alt={name ? `${name} logo` : "Company logo"}
          fill
          className="object-contain p-1"
          sizes="144px"
          unoptimized
          onError={() => setImgFailed(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "flex shrink-0 items-center justify-center bg-brand-600 font-semibold text-white shadow-sm ring-1 ring-brand-700/20",
        sizeClass,
        shapeClass,
        className
      )}
      title={name || "Company"}
      aria-label={name ? `${name} logo placeholder` : "Company logo placeholder"}
    >
      {getInitials(name)}
    </div>
  );
}
