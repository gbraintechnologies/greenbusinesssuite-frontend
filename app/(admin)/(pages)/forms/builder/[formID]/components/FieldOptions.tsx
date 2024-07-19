"use client";

import useForm from "@/hooks/useForm";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";

import { Switch } from "@headlessui/react";
import Border from "@/components/Border/Border";

// icons
import { CiCircleInfo } from "react-icons/ci";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";

// icons

import { IoIosArrowDown } from "react-icons/io";
import ChoiceValuesEditing from "./ChoiceValuesEditing";
import { capitalize } from "@mui/material";
import services from "@/services";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

function FieldOptions({ refetch }: any) {
  const { activeField, updateActiveField, form, updateIsTemplate } = useForm();

  let [localField, setLocalField] = useState(activeField?.field);

  const { data: formStatusCount } = useQuery({
    queryKey: ["Get forms status count"],
    queryFn: services.getFormStatusCountById(Number(form?.id)),
    enabled: Boolean(form?.id),
  });

  // update local copy if changes are made
  useEffect(() => {
    setLocalField(activeField?.field);
  }, [activeField]);

  const inputStyle =
    "border border-gray-200 focus:outline-none rounded-lg p-2 ";

  const labelStyle = "font-light";

  const insightTypes = [
    { name: "None", displayType: null },
    { name: "Sum", displayType: "single" },
    { name: "Average", displayType: "single" },
    { name: "Count", displayType: "bar-chart" },
  ];

  const displayTypes = [
    { name: "Bar chart", value: "bar-chart" },
    { name: "Pie chart", value: "pie-chart" },
  ];

  // Updating  main form data
  useEffect(() => {
    updateActiveField(activeField?.section, localField);
  }, [localField]);

  if (localField) {
    const { isMandatory, label, fieldDataType, placeHolder, horizontalAlign } =
      localField;

    return (
      <div className="bg-white  pb-[25rem] h-screen  no-scrollbar  overflow-y-scroll  border-l-2 border-gray-200 p-3">
        {/* TABS */}
        <div className="bg-gray-100 p-1 text-sm rounded-lg flex gap-3 items-center justify-center">
          <div className="bg-white text-center font-medium p-1 flex-1 rounded-lg">
            Field Options
          </div>

          {/* <button className="flex-1 disabled:cursor-not-allowed">
            Options
          </button>
          <button className="flex-1 disabled:cursor-not-allowed">
            Advanced
          </button> */}
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
                  name: e.target.value,
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

          {/* HINT */}
          {/* <div className="flex flex-col gap-3">
            <label className={labelStyle}>Hint</label>
            <input
              value={name}
              placeholder="Add your hint text heree"
              className={inputStyle}
              onChange={(e) =>
                setLocalField((prev: any) => ({
                  ...prev,
                  hint: e.target.value,
                }))
              }
              onBlur={() => updateActiveField(activeField.section, localField)}
            />
          </div> */}
        </div>

        {/* CHOICE VALUES EDITING FOR DROPDOWNS AND CHECKBOXES */}
        {(fieldDataType === "dropdown" || fieldDataType === "checkboxes") && (
          <ChoiceValuesEditing
            setLocalField={setLocalField}
            localField={localField}
          />
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

        {/* INSIGHT TYPE */}
        {(fieldDataType === "number" ||
          fieldDataType === "dropdown" ||
          fieldDataType === "checkboxes") && (
          <div>
            <p className="font-medium text-base mb-4">Insight Type</p>{" "}
            <Dropdown>
              <DropdownTrigger>
                <button className="bg-white flex items-center justify-between border rounded-xl px-4 py-2 w-full text-left">
                  <span className="block truncate">
                    {localField?.statisticalFunction
                      ? capitalize(localField?.statisticalFunction)
                      : "None"}
                  </span>

                  <IoIosArrowDown className="h-5 w-5 text-gray-600" size={20} />
                </button>
              </DropdownTrigger>
              <DropdownMenu
                className="shadow-md bg-white border border-[#F1F5F9] w-full rounded-lg flex flex-col gap-3"
                aria-label="Static Actions"
              >
                {insightTypes.map((type: any) => {
                  return (
                    <DropdownItem
                      key={type.id}
                      onClick={() => {
                        setLocalField((prev: any) => ({
                          ...prev,
                          isStatisticalField:
                            type?.name === "None" ? false : true,
                          displayType: type?.displayType
                            ? type?.displayType
                            : "",
                          statisticalFunction:
                            type?.name === "None"
                              ? null
                              : type?.name.toLowerCase(),
                        }));
                      }}
                      className="items-center w-72 p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
                    >
                      {type.name}
                    </DropdownItem>
                  );
                })}
              </DropdownMenu>
            </Dropdown>
            {/* <Listbox
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
            </Listbox> */}
          </div>
        )}

        {/* SELECTING BAR CHART OR PIE CHART IF FUNCTION IS COUNT */}
        {localField?.statisticalFunction === "count" && (
          <div className="mt-5">
            <p className="font-medium text-base mb-4">Charting Type</p>{" "}
            <Dropdown>
              <DropdownTrigger>
                <button className="bg-white flex items-center justify-between border rounded-xl px-4 py-2 w-full text-left">
                  <span className="block truncate">
                    {capitalize(localField?.displayType).replace("-", " ")}
                  </span>

                  <IoIosArrowDown className="h-5 w-5 text-gray-600" size={20} />
                </button>
              </DropdownTrigger>
              <DropdownMenu
                className="shadow-md bg-white border border-[#F1F5F9] w-full rounded-lg flex flex-col gap-3"
                aria-label="Static Actions"
              >
                {displayTypes.map((type: any) => {
                  return (
                    <DropdownItem
                      key={type.id}
                      onClick={() => {
                        setLocalField((prev: any) => ({
                          ...prev,
                          displayType: type?.value,
                        }));
                      }}
                      className="items-center w-72 p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
                    >
                      {type.name}
                    </DropdownItem>
                  );
                })}
              </DropdownMenu>
            </Dropdown>
          </div>
        )}

        {/* TODO: DELETE ELEMENT */}

        {/* ONLY ALLOW DELETION IF NO RESPONSES */}
        {formStatusCount && formStatusCount?.totalCount > 0 ? (
          <div className="bg-red-50 p-3 rounded-lg text-lg flex flex-row gap-2">
            <CiCircleInfo size={20} />{" "}
            <p className="text-xs font-light italic">
              Form fields cannot be deleted since this form has started taking
              responses
            </p>
          </div>
        ) : (
          <div className="px-2 mt-10">
            <p className="font-medium text-base mb-4">Delete Form Field</p>

            <button
              onClick={() => {
                services
                  .deleteFormField(localField.id)
                  .then(() => {
                    //
                    toast.success("Deleted form field");
                    refetch();
                  })
                  .catch((e) => {
                    toast.error("Error deleting");
                  });
              }}
              className="bg-[#DC2626] hover:bg-red-800 px-4 flex items-center gap-2 text-sm text-white py-2 rounded-lg"
            >
              <AiOutlineDelete
                size={20}
                className="text-white cursor-pointer"
              />{" "}
              Delete
            </button>
          </div>
        )}

        <Border />

        {/* use as template */}
        <div className="bg-[#F8FAFC] py-3 mt-10 px-5  rounded-lg flex gap-3 items-center justify-between">
          <div>
            <p className="font-medium text-base">Use form as template</p>{" "}
            <p className="text-xs font-light text-gray-500">
              The form will be used by the assigned company, and a similar
              template will be created for reuse with other forms.
            </p>
          </div>
          <Switch
            checked={form?.isTemplate}
            onChange={() => {
              //  set form as template
              updateIsTemplate(!form?.isTemplate);
            }}
            className={`${form?.isTemplate ? "bg-primary-green" : "bg-gray-500"}
          relative inline-flex h-[24px] w-[48px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`}
          >
            <span
              aria-hidden="true"
              className={`${
                form?.isTemplate ? "translate-x-6" : "translate-x-0"
              }
            pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
            />
          </Switch>
        </div>
      </div>
    );
  }
}

export default FieldOptions;
