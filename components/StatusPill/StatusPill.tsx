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
      <span className="rounded-full bg-[#F1F5F9] px-5 py-1 text-xs capitalize text-[#344054]">
        —
      </span>
    );
  }

  const lower = normalized.toLowerCase();
  const label = lower.replaceAll("_", " ");

  if (
    lower.includes("inactive") ||
    lower.includes("temp") ||
    lower.includes("incomplete") ||
    lower.includes("process")
  ) {
    return (
      <span className="rounded-full bg-[#FFFBEB] px-5 py-1 text-xs capitalize text-[#D97706]">
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
        className={`rounded-full bg-[#F0FDF4] px-5 py-1 text-xs text-[#16A34A] ${textTransform}`}
      >
        {label}
      </span>
    );
  }

  if (lower.includes("pend")) {
    return (
      <span
        className={`rounded-full bg-blue-100 px-5 py-1 text-xs text-blue-700 ${textTransform}`}
      >
        {label}
      </span>
    );
  }

  if (success === false || lower.includes("fail")) {
    return (
      <span
        className={`rounded-full bg-red-50 px-5 py-1 text-xs text-red-700 ${textTransform}`}
      >
        {label}
      </span>
    );
  }

  return (
    <span className="rounded-full bg-[#F1F5F9] px-5 py-1 text-xs capitalize text-[#344054]">
      {label}
    </span>
  );
}

export default StatusPill;
