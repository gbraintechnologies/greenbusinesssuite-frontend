"use client";

import useForm from "@/hooks/useForm";
import React, { useEffect, Fragment, useRef, useState } from "react";

import { Listbox, Transition } from "@headlessui/react";

import { Switch } from "@headlessui/react";
import Border from "@/components/Border/Border";

// icons

import { IoIosArrowDown } from "react-icons/io";
import ChoiceValuesEditing from "./ChoiceValuesEditing";

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

  const insightTypes = [
    { id: 1, name: "None", displayType: null },
    { id: 2, name: "Sum", displayType: "sum" },
    { id: 3, name: "Average", displayType: "sum" },
  ];

  const [selectedInsightType, setSelectedInsightType] = useState({
    id: 1,
    name: "None",
  });

  // Updating form field with insight type
  useEffect(() => {
    setLocalField((prev: any) => ({
      ...prev,
      isStatisticalField: selectedInsightType?.name === "None" ? false : true,
      displayType: "bar-chart",
      statisticalFunction:
        selectedInsightType?.name === "None"
          ? null
          : selectedInsightType?.name.toLowerCase(),
    }));
    updateActiveField(activeField.section, {
      ...localField,
      isStatisticalField: selectedInsightType?.name === "None" ? false : true,
      displayType: "bar-chart",
      statisticalFunction:
        selectedInsightType?.name === "None"
          ? null
          : selectedInsightType?.name.toLowerCase(),
    });
  }, [selectedInsightType]);

  if (localField) {
    const {
      isMandatory,
      label,
      fieldDataType,
      choiceValues,
      name,
      placeHolder,
      horizontalAlign,
    } = localField;

    return (
      <div className="bg-white overflow-y-auto pb-40 min-h-[100vh]  border-l-2 border-gray-200 p-3">
        {/* TABS */}
        <div className="bg-gray-100 p-1 text-sm rounded-lg flex gap-3 items-center justify-center">
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
        <div className="bg-[#F8FAFC] py-3 mt-8 px-5  rounded-lg flex gap-3 items-center justify-between">
          <p className="font-medium text-base">Required field</p>{" "}
          <Switch
            checked={isMandatory}
            onChange={() => {
              setLocalField((prev: any) => ({
                ...prev,
                isMandatory: !prev.isMandatory,
              }));

              updateActiveField(activeField.section, {
                ...localField,
                isMandatory: !localField.isMandatory,
              });
            }}
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

        <div className="flex flex-col gap-5 my-5">
          {/* LABEL */}
          <div className="flex flex-col gap-3">
            <label className={labelStyle}>Field Label</label>
            <input
              value={label}
              placeholder="Edit field label"
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
          {/* PLACEHOLDER */}
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
              value={name}
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

        {/* CHOICE VALUES EDITING FOR DROPDOWNS AND CHECKBOXES */}
        {(fieldDataType === "dropdown" || fieldDataType === "checkboxes") && (
          <ChoiceValuesEditing localField={localField} />
        )}

        {/* HORIZONTAL ALIGNMENT */}
        <div className="bg-[#F8FAFC] py-3 mt-10 px-5  rounded-lg flex gap-3 items-center justify-between">
          <p className="font-medium text-base">Horizontal alignment</p>{" "}
          <Switch
            checked={horizontalAlign}
            onChange={() => {
              setLocalField((prev: any) => ({
                ...prev,
                horizontalAlign: !prev.horizontalAlign,
              }));
              updateActiveField(activeField.section, {
                ...localField,
                horizontalAlign: !localField.horizontalAlign,
              });
            }}
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

        <Border />
        {localField.fieldDataType === "number" && (
          <div>
            <p className="font-medium text-base mb-4">Insight Type</p>{" "}
            <Listbox
              value={selectedInsightType}
              onChange={setSelectedInsightType}
            >
              <div className="relative mt-1">
                <Listbox.Button className="bg-white border rounded-xl px-4 py-2 w-full text-left">
                  <span className="block truncate">
                    {selectedInsightType.name}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <IoIosArrowDown
                      className="h-5 w-5 text-gray-400"
                      size={20}
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                    {insightTypes.map((type: any) => (
                      <Listbox.Option
                        key={type.id}
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                            active
                              ? "bg-green-50 text-primary-green"
                              : "text-gray-900"
                          }`
                        }
                        value={type}
                      >
                        {type.name}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
        )}
      </div>
    );
  }
}

export default FieldOptions;
