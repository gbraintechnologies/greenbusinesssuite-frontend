"use client";

import React from "react";

import { BiSolidMessageError } from "react-icons/bi";

function ErrorGlobal({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex w-screen h-screen items-center justify-center">
      <div>
        <BiSolidMessageError size={60} />
        <h4 className="text-4xl font-bold mt-10">An error occured.</h4>
        <p className="text-light mt-2 max-w-md mb-10">Refresh this page</p>
        <button
          className="px-4 py-2 rounded-lg bg-black text-white"
          onClick={() => reset()}
        >
          Refresh
        </button>
      </div>
    </div>
  );
}

export default ErrorGlobal;
