"use client";

import React, { useEffect, useState } from "react";

import { AiOutlineLoading } from "react-icons/ai";

function SetupLoader() {
  //
  const statusText = [
    { id: 0, text: "Setting up your organization" },
    { id: 1, text: "Gathering required resources" },
    { id: 2, text: "Please wait a moment" },
    { id: 3, text: "Loading interface components" },
    { id: 4, text: "Taking a bit longer than usual" },
    { id: 5, text: "Finalizing initialization" },
  ];

  const [currentStatus, setCurrentStatus] = useState(statusText[0]);

  useEffect(() => {
    setTimeout(() => {
      if (currentStatus.id === 5) {
        setCurrentStatus(statusText[0]);
      } else {
        setCurrentStatus(statusText[currentStatus.id + 1]);
      }
    }, 2000);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStatus]);

  //
  return (
    <div className="flex items-center justify-center gap-10">
      <div className="flex flex-col gap-2">
        <AiOutlineLoading className="animate-spin text-gray-500" />
        <p className="text-sm text-gray-500 animate-fade">
          {currentStatus.text}
        </p>
        <div className="h-8 w-52 bg-gray-300 rounded-xl animate-pulse" />
        {currentStatus.id % 2 == 0 ? (
          <div className="h-5 w-48 bg-gray-300 rounded-xl animate-pulse" />
        ) : (
          <div className="h-5 w-56 bg-gray-300 rounded-xl animate-pulse" />
        )}
      </div>
    </div>
  );
}

export default SetupLoader;
