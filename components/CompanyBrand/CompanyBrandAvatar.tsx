"use client";

import Image from "next/image";
import clsx from "clsx";
import MeshSuiteMark from "@/public/icons/MeshSuiteMark";

const sizeMap = {
  xs: "h-8 w-8 text-[10px] rounded-lg",
  sm: "h-10 w-10 text-xs rounded-xl",
  md: "h-14 w-14 text-sm rounded-2xl",
  lg: "h-24 w-24 text-2xl rounded-2xl",
  xl: "h-36 w-36 text-4xl rounded-3xl",
};

const markSizeMap = {
  xs: "h-4 w-4",
  sm: "h-5 w-5",
  md: "h-7 w-7",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
};

type Props = {
  logoUrl?: string | null;
  name?: string;
  size?: keyof typeof sizeMap;
  className?: string;
  shape?: "squircle" | "circle";
};

function hasValidLogo(logoUrl?: string | null) {
  if (!logoUrl) return false;
  const trimmed = logoUrl.trim();
  return trimmed.length > 1 && trimmed !== "null" && trimmed !== "undefined";
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
  const sizeClass = sizeMap[size];
  const shapeClass = shape === "circle" ? "!rounded-full" : "";

  if (hasValidLogo(logoUrl)) {
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
          className="object-cover"
          sizes="144px"
          unoptimized
        />
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "flex shrink-0 items-center justify-center bg-brand-600 shadow-sm ring-1 ring-brand-700/20",
        sizeClass,
        shapeClass,
        className
      )}
      title="MeshSuite"
      aria-label="MeshSuite logo placeholder"
    >
      <MeshSuiteLogoMark className={markSizeMap[size]} />
    </div>
  );
}
