import React from "react";

function FormField({ field, section }: any) {
  // console.log("field", field);

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

  switch (fieldDataType) {
    case "text":
      return (
        <div className={`${horizontalAlign ? "" : "col-span-2"}`}>
          <label className="font-sm text-gray-400">{label}</label>
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

    case "integer":
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

    case "string":
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
  }
}

export default FormField;
