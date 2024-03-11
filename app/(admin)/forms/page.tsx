"use client";

import AddFormIcon from "@/public/icons/AddFormIcon";
import React from "react";

// icons
import EmptyList from "./components/EmptyList";
import ImportFormIcon from "@/public/icons/ImportFormIcon";

import { useRouter } from "next/navigation";

function Forms() {
  const router = useRouter();
  // ACTIONS
  const actions = [
    {
      icon: <AddFormIcon />,
      title: "Start a new form",
      desc: "Create a new form from scratch",
      func: () => {
        //
        router.push("/forms/builder");
      },
    },
    {
      icon: <ImportFormIcon />,
      title: "Use existing template",
      desc: "Create a form based of another form",

      func: () => {
        //
      },
    },
  ];

  const recentForms = [];

  return (
    <div className="px-5">
      <h1 className="text-2xl font-bold mb-8">Forms</h1>

      <div className="grid grid-cols-3 gap-2">
        {actions.map((action, idx) => {
          return (
            <button
              onClick={action.func}
              className="flex gap-1 items-center rounded-lg p-2 py-3 border-[#E2E8F0] border bg-[#F8FAFC]"
              key={idx}
            >
              {action.icon}
              <div className="text-left">
                <h4 className="font-medium text-base">{action.title}</h4>
                <p className="font-light text-sm">{action.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* recent forms  */}

      {recentForms.length === 0 ? (
        <div className="mt-20">
          <EmptyList />
        </div>
      ) : null}
    </div>
  );
}

export default Forms;
