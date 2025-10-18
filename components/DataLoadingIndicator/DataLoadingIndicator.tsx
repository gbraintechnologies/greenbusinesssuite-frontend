"use client";

import { Spinner } from "@heroui/react";
import React from "react";

function DataLoadingIndicator({
  text = "Please wait a moment...",
  title = "Loading",
  color = "normal",
}: {
  text?: string;
  title?: string;
  color?: "normal" | "white";
}) {
  if (color == "white") {
    return (
      <div className="w-full py-10 min-h-[20vh] flex items-center justify-center gap-2 flex-col">
        <Spinner color="white" size="lg" />
        <h4 className="mt-3 text-3xl text-white font-semibold">{title}</h4>
        <p className="text-white text-sm font-light">{text}</p>
      </div>
    );
  }
  return (
    <div className="w-full py-10 min-h-[40vh] flex items-center justify-center gap-2 flex-col">
      <Spinner size="lg" />
      <h4 className="mt-3 text-3xl text-gray-600 font-semibold">{title}</h4>
      <p className="text-gray-400 text-sm font-light">{text}</p>
    </div>
  );
}

export default DataLoadingIndicator;
