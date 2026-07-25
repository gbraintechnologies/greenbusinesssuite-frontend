"use client";

import React from "react";
import { BiSolidMessageError } from "react-icons/bi";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white">
      <div className="text-center">
        <BiSolidMessageError size={60} className="mx-auto text-red-500" />
        <h4 className="mt-10 text-4xl font-bold">Something went wrong</h4>
        <p className="mt-2 max-w-md text-gray-500">
          {error.message || "An unexpected error occurred."}
        </p>
        <button
          type="button"
          className="mt-10 rounded-lg bg-black px-4 py-2 text-white"
          onClick={() => reset()}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
