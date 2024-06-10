"use client";

import useClientForm from "@/hooks/useClientForm";
//
import React from "react";

function FormFieldValue({ field, section }: any) {
  const { fieldDataType, horizontalAlign, placeHolder, label } = field;

  // TYPES
  // text
  // integer
  // string
  // email
  // phone

  // main styles

  // functions

  const { saveSingleResponse } = useClientForm();

  const inputStyle = `border-[0.7px] w-full focus:outline-primary-green text-black placeholder:text-gray-400 mt-2 border-gray-200 px-3 py-2 rounded-lg`;
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
            value={field?.response}
            onChange={(e) =>
              saveSingleResponse(section?.id, field?.id, e.target.value)
            }
            rows={5}
            placeholder={placeHolder ? placeHolder : "Your answer here"}
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
          <input
            value={field?.response}
            onChange={(e) =>
              saveSingleResponse(section?.id, field?.id, e.target.value)
            }
            placeholder={placeHolder ? placeHolder : "Your answer here"}
            className={inputStyle}
          />
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
          <input
            value={field?.response}
            onChange={(e) =>
              saveSingleResponse(section?.id, field?.id, e.target.value)
            }
            placeholder={placeHolder ? placeHolder : "Your answer here"}
            className={inputStyle}
          />
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
          <input
            value={field?.response}
            onChange={(e) =>
              saveSingleResponse(section?.id, field?.id, e.target.value)
            }
            placeholder={placeHolder ? placeHolder : "Your answer here"}
            className={inputStyle}
          />
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
          <input
            value={field?.response}
            onChange={(e) =>
              saveSingleResponse(section?.id, field?.id, e.target.value)
            }
            placeholder={placeHolder ? placeHolder : "Your answer here"}
            className={inputStyle}
          />
        </div>
      );
  }
}

export default FormFieldValue;
