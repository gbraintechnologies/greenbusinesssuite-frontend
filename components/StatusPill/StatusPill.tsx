import React from "react";

function StatusPill({ status }: any) {
  if (
    status.toLowerCase().includes("inactive") ||
    status.toLowerCase().includes("temp")
  ) {
    return (
      <span className="text-[#D97706] bg-[#FFFBEB] capitalize text-xs px-5 rounded-full py-1">
        {status.toLowerCase().replaceAll("_", " ")}
      </span>
    );
  }
  
  if (
    status.toLowerCase().includes("success") ||
    status.toLowerCase().includes("active")
  ) {
    return (
      <span className="text-[#16A34A] bg-[#F0FDF4]  capitalize text-xs px-5 rounded-full py-1">
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
