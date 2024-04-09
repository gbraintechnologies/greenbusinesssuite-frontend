"use client";

import useForm from "@/hooks/useForm";
import React, { useEffect, useRef, useState } from "react";

import { Switch } from "@headlessui/react";

function FieldOptions() {
  const { activeField, updateActiveField } = useForm();

  let [localField, setLocalField] = useState(activeField?.field);

  // update local copy if changes are made
  useEffect(() => {
    setLocalField(activeField?.field);
  }, [activeField]);

  const inputStyle =
    "border border-gray-200 focus:outline-primary-green rounded-lg p-2";
  const labelStyle = "font-light";

  if (localField) {
    const { isMandatory, label, name, placeHolder, horizontalAlign } =
      localField;
    return (
      <div className="bg-white h-[100vh]  border-l-2 border-gray-200 p-3">
        {/* TABS */}
        <div className="bg-gray-100 p-1  text-sm rounded-lg flex gap-3 items-center justify-center">
          <button className="bg-white font-medium p-1 flex-1 rounded-lg">
            General
          </button>
          <button disabled className="flex-1 disabled:cursor-not-allowed">
            Options
          </button>
          <button disabled className="flex-1 disabled:cursor-not-allowed">
            Advanced
          </button>
        </div>

        {/* REQUIRED FIELD OR NOT */}
        <div className="bg-[#F8FAFC] py-3 mt-10 px-5  rounded-lg flex gap-3 items-center justify-between">
          <p className="font-medium text-base">Required field</p>{" "}
          <Switch
            checked={isMandatory}
            onChange={() =>
              setLocalField((prev: any) => ({
                ...prev,
                isMandatory: !prev.isMandatory,
              }))
            }
            className={`${isMandatory ? "bg-primary-green" : "bg-gray-500"}
          relative inline-flex h-[24px] w-[48px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`}
          >
            <span
              aria-hidden="true"
              className={`${isMandatory ? "translate-x-6" : "translate-x-0"}
            pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
            />
          </Switch>
        </div>

        <div className="flex flex-col gap-5 my-10">
          {/* LABEL */}
          <div className="flex flex-col gap-3">
            <label className={labelStyle}>Field Label</label>
            <input
              value={label}
              placeholder="Type a question"
              className={inputStyle}
              onChange={(e) =>
                setLocalField((prev: any) => ({
                  ...prev,
                  label: e.target.value,
                }))
              }
              onBlur={() => updateActiveField(activeField.section, localField)}
            />
          </div>
          {/* LABEL */}
          <div className="flex flex-col gap-3">
            <label className={labelStyle}>Placeholder</label>
            <input
              value={placeHolder}
              placeholder="Enter a placeholder text here"
              className={inputStyle}
              onChange={(e) =>
                setLocalField((prev: any) => ({
                  ...prev,
                  placeHolder: e.target.value,
                }))
              }
              onBlur={() => updateActiveField(activeField.section, localField)}
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className={labelStyle}>Hint</label>
            <input
              value={localField?.name}
              placeholder="Add your hint text heree"
              className={inputStyle}
              onChange={(e) =>
                setLocalField((prev: any) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              onBlur={() => updateActiveField(activeField.section, localField)}
            />
          </div>
        </div>

        {/* HORIZONTAL ALIGNMENT */}
        <div className="bg-[#F8FAFC] py-3 mt-10 px-5  rounded-lg flex gap-3 items-center justify-between">
          <p className="font-medium text-base">Horizontal alignment</p>{" "}
          <Switch
            checked={horizontalAlign}
            onChange={() =>
              setLocalField((prev: any) => ({
                ...prev,
                horizontalAlign: !prev.horizontalAlign,
              }))
            }
            className={`${horizontalAlign ? "bg-primary-green" : "bg-gray-500"}
          relative inline-flex h-[24px] w-[48px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`}
          >
            <span
              aria-hidden="true"
              className={`${horizontalAlign ? "translate-x-6" : "translate-x-0"}
            pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
            />
          </Switch>
        </div>
      </div>
    );
  }
}

export default FieldOptions;
