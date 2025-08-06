import { fromCamelCase } from "@/utils/toCamelCase";
import React from "react";

function Status({
  status,
  type = "form",
}: {
  status: string | undefined;
  type?: "form" | "card";
}) {
  let _status = status ? fromCamelCase(status) : "";

  const baseStyle = `
    ${type === "card" && "px-2 md:px-4 py-2 font-semibold uppercase text-base"} 
    ${type == "form" && "px-2 md:px-3 py-2 text-xs font-semibold"} 
    w-fit flex text-nowrap items-center font-normal rounded-md gap-2 `;

  if (status == undefined) {
    return <></>;
  }

  switch (status.toLowerCase()) {
    case "pending":
      return (
        <span className={`bg-blue-50  text-blue-600 ${baseStyle}`}>
          {_status}
        </span>
      );

    case "submitted":
      return (
        <span className={`bg-blue-50  text-blue-600 ${baseStyle}`}>
          {_status}
        </span>
      );

    case "active":
      return (
        <span className={`bg-green-100  text-green-600 ${baseStyle}`}>
          {_status}
        </span>
      );

    case "approved":
      return (
        <span className={`bg-green-100  text-green-600 ${baseStyle}`}>
          {_status}
        </span>
      );

    case "review":
      return (
        <span className={`bg-yellow-100  text-yellow-600 ${baseStyle}`}>
          {_status}
        </span>
      );

    case "processing":
      return (
        <span className={`bg-yellow-100  text-yellow-600 ${baseStyle}`}>
          {_status}
        </span>
      );

    case "amendment":
      return (
        <span className={`bg-lime-100  text-lime-600 ${baseStyle}`}>
          {_status}
        </span>
      );

    case "rejected":
      return (
        <span className={`bg-red-100  text-red-600 ${baseStyle}`}>
          {_status}
        </span>
      );

    case "inactive":
      return (
        <span className={`bg-red-100  text-red-600 ${baseStyle}`}>
          {_status}
        </span>
      );

    case "incomplete":
      return (
        <span className={`bg-red-50  text-red-600 ${baseStyle}`}>
          {_status}
        </span>
      );

    case "denied":
      return (
        <span className={`bg-red-50  text-red-600 ${baseStyle}`}>REJECTED</span>
      );

    default:
      return (
        <span className={`bg-gray-100 text-gray-600 ${baseStyle}`}>
          {_status}
        </span>
      );
  }
}

export default Status;
