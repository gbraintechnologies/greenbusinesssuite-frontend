import React from "react";

function StatusPill({
  status,
  success,
  textTransform = "capitalize",
}: {
  status: string;
  success?: boolean;
  textTransform?: string;
}) {
  if (status.toLowerCase().includes("process")) {
    return (
      <span className="text-[#D97706] font-bold  capitalize text-xs  rounded-full ">
        {status.toLowerCase().replaceAll("_", " ")}
      </span>
    );
  }

  if (status.toLowerCase().includes("pending")) {
    return (
      <span className="text-[#0E7490] font-bold  capitalize text-xs  rounded-full ">
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
        className={`text-[#16A34A] font-bold  ${textTransform} text-xs  rounded-full `}
      >
        {status.toLowerCase().replaceAll("_", " ")}
      </span>
    );
  }

  if (success === false) {
    return (
      <span
        className={`text-red-700 bg-red-50 font-bold ${textTransform} text-xs  rounded-full `}
      >
        {status.toLowerCase().replaceAll("_", " ")}
      </span>
    );
  }

  // DEFAULT FILTER
  return (
    <span className="  text-[#344054] font-bold  capitalize text-xs  rounded-full ">
      {status.toLowerCase().replaceAll("_", " ")}
    </span>
  );
}

export default StatusPill;
