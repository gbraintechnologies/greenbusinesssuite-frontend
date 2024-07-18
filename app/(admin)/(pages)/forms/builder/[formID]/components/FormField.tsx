import useForm from "@/hooks/useForm";
import React from "react";

// icons
import { LuUploadCloud } from "react-icons/lu";
import { IoIosArrowDown } from "react-icons/io";
import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import Border from "@/components/Border/Border";

function FormField({ field, section }: any) {
  const {
    fieldDataType,
    horizontalAlign,
    name,
    description,
    placeHolder,
    instruction,
    choiceValues,
    label,
  } = field;

  const { activeField, setActiveField } = useForm();

  // DATA TYPES
  // long-text
  // number
  // short-text
  // email
  // phone
  // upload
  // dropdown
  // multiple-choice

  let activeFieldStyle =
    "border-[0.4px] rounded-lg border-[#BBF7D0] bg-[#F0FDF4] bg-opacity-30";

  switch (fieldDataType) {
    case "long-text":
      return (
        <div
          onClick={() => setActiveField({ field, section })}
          className={`
           ${field?.id === activeField?.field?.id && activeFieldStyle}
          ${horizontalAlign ? "col-span-1" : "col-span-2"} p-2 
          `}
        >
          <label className="font-sm text-gray-400">
            {label ? label : "No label"}
          </label>
          <textarea
            rows={5}
            disabled
            placeholder={placeHolder ? placeHolder : "No placeholder specified"}
            className="border w-full  text-gray-400 mt-2 border-gray-200 px-3 py-2 rounded-lg"
          />
        </div>
      );

    case "number":
      return (
        <div
          onClick={() => setActiveField({ field, section })}
          className={`
           ${field?.id === activeField?.field?.id && activeFieldStyle}
          ${horizontalAlign ? "col-span-1" : "col-span-2"} p-2 
          `}
        >
          <label className="font-sm text-gray-400">
            {label ? label : "No label"}
          </label>
          <p className="border text-gray-400 mt-2 border-gray-200 px-3 py-2 rounded-lg">
            {placeHolder ? placeHolder : "No placeholder specified"}{" "}
          </p>
        </div>
      );

    case "short-text":
      return (
        <div
          onClick={() => setActiveField({ field, section })}
          className={`
           ${field?.id === activeField?.field?.id && activeFieldStyle}
          ${horizontalAlign ? "col-span-1" : "col-span-2"} p-2 
          `}
        >
          <label className="font-sm text-gray-400">
            {" "}
            {label ? label : "No label"}
          </label>
          <p className="border text-gray-400 mt-2 border-gray-200 px-3 py-2 rounded-lg">
            {placeHolder ? placeHolder : "No placeholder specified"}{" "}
          </p>
        </div>
      );

    case "email":
      return (
        <div
          onClick={() => setActiveField({ field, section })}
          className={`
           ${field?.id === activeField?.field?.id && activeFieldStyle}
          ${horizontalAlign ? "col-span-1" : "col-span-2"} p-2 
          `}
        >
          <label className="font-sm text-gray-400">
            {label ? label : "No label"}
          </label>
          <p className="border text-gray-400 mt-2 border-gray-200 px-3 py-2 rounded-lg">
            {placeHolder ? placeHolder : "No placeholder specified"}
          </p>
        </div>
      );

    case "phone":
      return (
        <div
          onClick={() => setActiveField({ field, section })}
          className={`
           ${field?.id === activeField?.field?.id && activeFieldStyle}
          ${horizontalAlign ? "col-span-1" : "col-span-2"} p-2 
          `}
        >
          <label className="font-sm text-gray-400">
            {label ? label : "No label"}
          </label>
          <p className="border text-gray-400 mt-2 border-gray-200 px-3 py-2 rounded-lg">
            {placeHolder ? placeHolder : "No placeholder specified"}
          </p>
        </div>
      );

    case "dropdown":
      return (
        <div
          onClick={() => setActiveField({ field, section })}
          className={`
           ${field?.id === activeField?.field?.id && activeFieldStyle}
          ${horizontalAlign ? "col-span-1" : "col-span-2"} p-2 
          `}
        >
          <label className="font-sm text-gray-400">
            {label ? label : "No label"}
          </label>
          <p className="border text-gray-400 mt-2 border-gray-200 px-3 py-2 flex justify-between rounded-lg">
            {placeHolder ? placeHolder : "No placeholder specified"}
            <IoIosArrowDown />
          </p>
        </div>
      );

    case "checkboxes":
      return (
        <div
          onClick={() => setActiveField({ field, section })}
          className={`
           ${field?.id === activeField?.field?.id && activeFieldStyle}
          ${horizontalAlign ? "col-span-1" : "col-span-2"} p-2 
          `}
        >
          <label className="font-sm text-gray-400">
            {label ? label : "No label"}
          </label>
          <p className="mt-2">{placeHolder}</p>

          <div className=" text-gray-400 px-3 py-2 grid grid-cols-2 gap-x-4 gap-y-1">
            {field.choiceValues.map((value: any) => {
              return (
                <div className="flex flex-row gap-2">
                  <div>
                    <MdOutlineCheckBoxOutlineBlank size={20} />
                  </div>{" "}
                  <p className="text-xl">{value}</p>
                </div>
              );
            })}
          </div>
        </div>
      );

    case "upload":
      return (
        <div
          onClick={() => setActiveField({ field, section })}
          className={`
           ${field?.id === activeField?.field?.id && activeFieldStyle}
          ${horizontalAlign ? "col-span-1" : "col-span-2"} p-2 
          `}
        >
          <label className="font-sm text-gray-400 mb-2">
            {label ? label : "No label"}
          </label>
          <div className="border text-gray-400 mt-2 border-gray-200 p-7 my-4 flex items-center justify-center flex-col gap-1 text-center text-sm rounded-lg">
            <LuUploadCloud size={32} />
            {placeHolder ? placeHolder : "No placeholder specified"}
            <p className="text-xs font-light text-gray-500">
              Supported formats: PNG, JPEG, PDF (1MB max file size)
            </p>
            <button className="border border-gray-100 shadow px-3 py-1 rounded-lg mt-5">
              Select files{" "}
            </button>
          </div>
        </div>
      );
  }
}

export default FormField;
