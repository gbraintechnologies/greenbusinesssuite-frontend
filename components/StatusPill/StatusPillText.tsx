import React from "react";

function StatusPill({
  status,
  success,
  textTransform = "capitalize",
}: {
  status?: string | null;
  success?: boolean;
  textTransform?: string;
}) {
  const normalized = (status ?? "").toString().trim();

  if (!normalized) {
    return (
      <span className="rounded-full text-xs font-bold capitalize text-[#344054]">
        —
      </span>
    );
  }

  const lower = normalized.toLowerCase();
  const label = lower.replaceAll("_", " ");

  if (lower.includes("process")) {
    return (
      <span className="rounded-full text-xs font-bold capitalize text-[#D97706]">
        {label}
      </span>
    );
  }

  if (lower.includes("pending")) {
    return (
      <span className="rounded-full text-xs font-bold capitalize text-[#0E7490]">
        {label}
      </span>
    );
  }

  if (
    lower.includes("success") ||
    lower.includes("active") ||
    lower.includes("complete") ||
    success === true
  ) {
    return (
      <span
        className={`rounded-full text-xs font-bold text-[#16A34A] ${textTransform}`}
      >
        {label}
      </span>
    );
  }

  if (success === false) {
    return (
      <span
        className={`rounded-full bg-red-50 text-xs font-bold text-red-700 ${textTransform}`}
      >
        {label}
      </span>
    );
  }

  return (
    <span className="rounded-full text-xs font-bold capitalize text-[#344054]">
      {label}
    </span>
  );
}

export default StatusPill;
