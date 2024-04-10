import useForm from "@/hooks/useForm";
import React from "react";

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

  // Rend

  // types
  // text
  // integer
  // string
  // email
  // phone

  let activeFieldStyle =
    "border-[0.2px] rounded-lg border-[#BBF7D0] bg-[#F0FDF4] bg-opacity-30";

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
            className="border w-full focus:outline-primary-green text-gray-400 mt-2 border-gray-200 px-3 py-2 rounded-lg"
          />

          <span className="text-xs font-light text-green-400">
            {" "}
            / {fieldDataType}
          </span>
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
            <span className="text-xs font-light text-green-400">
              {" "}
              / {fieldDataType}
            </span>
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
            <span className="text-xs font-light text-green-400">
              {" "}
              / {fieldDataType}
            </span>
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
            <span className="text-xs font-light text-green-400">
              {" "}
              / {fieldDataType}
            </span>
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
            <span className="text-xs font-light text-green-400">
              {" "}
              / {fieldDataType}
            </span>
          </p>
        </div>
      );
  }
}

export default FormField;
