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

  // Rend

  // types
  // text
  // integer
  // string
  // email
  // phone

  switch (fieldDataType) {
    case "long-text":
      return (
        <div className={`${horizontalAlign ? "" : "col-span-2"}`}>
          <label className="font-sm text-gray-400">
            {label ? label : "No label"}
          </label>
          <textarea
            rows={5}
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
        <div>
          <label className="font-sm text-gray-400">
            {label ? label : "No label provided"}
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
        <div>
          <label className="font-sm text-gray-400">{label}</label>
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
        <div>
          <label className="font-sm text-gray-400">
            {label ? label : "No Label provided"}
          </label>
          <p className="border text-gray-400 mt-2 border-gray-200 px-3 py-2 rounded-lg">
            Email place holder
            <span className="text-xs font-light text-green-400">
              {" "}
              / {fieldDataType}
            </span>
          </p>
        </div>
      );

    case "phone":
      return (
        <div>
          <label className="font-sm text-gray-400">
            {label ? label : "No Label provided"}
          </label>
          <p className="border text-gray-400 mt-2 border-gray-200 px-3 py-2 rounded-lg">
            Phone
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
