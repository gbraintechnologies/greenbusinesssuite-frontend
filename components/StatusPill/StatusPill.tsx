import React from "react";
import { StringSchema } from "yup";

function StatusPill({
  status,
  success,
  textTransform = "capitalize",
}: {
  status: string;
  success?: boolean;
  textTransform?: string;
}) {
  if (
    status.toLowerCase().includes("inactive") ||
    status.toLowerCase().includes("temp") ||
    status.toLowerCase().includes("incomplete") ||
    status.toLowerCase().includes("process")
  ) {
    return (
      <span className="text-[#D97706] bg-[#FFFBEB] capitalize text-xs px-5 rounded-full py-1">
        {status.toLowerCase().replaceAll("_", " ")}
      </span>
    );
  }

  if (
    status.toLowerCase().includes("success") ||
    status.toLowerCase().includes("active") ||
    status.toLowerCase().includes("complete") ||
    success === true
  ) {
    return (
      <span
        className={`text-[#16A34A] bg-[#F0FDF4]  ${textTransform} text-xs px-5 rounded-full py-1`}
      >
        {status.toLowerCase().replaceAll("_", " ")}
      </span>
    );
  }

  if (status.toLowerCase().includes("pend")) {
    return (
      <span
        className={`text-blue-700 bg-blue-100  ${textTransform} text-xs px-5 rounded-full py-1`}
      >
        {status.toLowerCase().replaceAll("_", " ")}
      </span>
    );
  }

  if (success === false) {
    return (
      <span
        className={`text-red-700 bg-red-50 ${textTransform} text-xs px-5 rounded-full py-1`}
      >
        {status.toLowerCase().replaceAll("_", " ")}
      </span>
    );
  }

  if (status.toLowerCase().includes("fail")) {
    return (
      <span
        className={`text-red-700 bg-red-50 ${textTransform} text-xs px-5 rounded-full py-1`}
      >
        {status.toLowerCase().replaceAll("_", " ")}
      </span>
    );
  }

  // DEFAULT FILTER
  return (
    <span className="  text-[#344054] bg-[#F1F5F9]  capitalize text-xs px-5 rounded-full py-1">
      {status.toLowerCase().replaceAll("_", " ")}
    </span>
  );
}

export default StatusPill;
