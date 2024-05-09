"use client";

//
import React from "react";

function FormFieldValue({ field, section }: any) {
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

  // main styles

  const inputStyle = `border-[0.7px] w-full focus:outline-primary-green text-gray-400 mt-2 border-gray-200 px-3 py-2 rounded-lg`;
  const labelStyle = `font-sm text-gray-400`;

  switch (fieldDataType) {
    case "long-text":
      return (
        <div
          className={`
          ${horizontalAlign ? "col-span-1" : "col-span-2"} p-2  mb-3
          `}
        >
          <label className={labelStyle}>{label}</label>
          <textarea
            rows={5}
            placeholder={placeHolder ? placeHolder : "No placeholder specified"}
            className={inputStyle}
          />
        </div>
      );

    case "number":
      return (
        <div
          className={` ${
            horizontalAlign ? "col-span-1" : "col-span-2"
          } p-2 mb-3 
          `}
        >
          <label className={labelStyle}>{label}</label>
          <input placeholder={placeHolder} className={inputStyle} />
        </div>
      );

    case "short-text":
      return (
        <div
          className={`
          ${horizontalAlign ? "col-span-1" : "col-span-2"} p-2 mb-3
          `}
        >
          <label className={labelStyle}>{label}</label>
          <input placeholder={placeHolder} className={inputStyle} />
        </div>
      );

    case "email":
      return (
        <div
          className={`
          ${horizontalAlign ? "col-span-1" : "col-span-2"} p-2 mb-3
          `}
        >
          <label className={labelStyle}>{label}</label>
          <input placeholder={placeHolder} className={inputStyle} />
        </div>
      );

    case "phone":
      return (
        <div
          className={`
          ${horizontalAlign ? "col-span-1" : "col-span-2"} p-2 mb-3
          `}
        >
          <label className={labelStyle}>{label}</label>
          <input placeholder={placeHolder} className={inputStyle} />
        </div>
      );
  }
}

export default FormFieldValue;
