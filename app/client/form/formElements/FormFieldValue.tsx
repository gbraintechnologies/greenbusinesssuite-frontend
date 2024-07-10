"use client";

import useClientForm from "@/hooks/useClientForm";
//
import React from "react";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { IoIosArrowDown } from "react-icons/io";
import { LuUploadCloud } from "react-icons/lu";

function FormFieldValue({ field, section, viewOnly }: any) {
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

  const inputStyle = `border-[0.7px] w-full  text-black placeholder:text-gray-400 mt-2 border-gray-200 px-3 py-2 rounded-lg`;
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
            onBlur={(e) =>
              saveSingleResponse(section?.id, field?.id, e.target.value)
            }
            disabled={viewOnly}
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
            onBlur={(e) =>
              saveSingleResponse(section?.id, field?.id, e.target.value)
            }
            disabled={viewOnly}
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
            onBlur={(e) =>
              saveSingleResponse(section?.id, field?.id, e.target.value)
            }
            disabled={viewOnly}
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
            onBlur={(e) =>
              saveSingleResponse(section?.id, field?.id, e.target.value)
            }
            disabled={viewOnly}
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
            onBlur={(e) =>
              saveSingleResponse(section?.id, field?.id, e.target.value)
            }
            disabled={viewOnly}
            value={field?.response}
            onChange={(e) =>
              saveSingleResponse(section?.id, field?.id, e.target.value)
            }
            placeholder={placeHolder ? placeHolder : "Your answer here"}
            className={inputStyle}
          />
        </div>
      );

    case "dropdown":
      return (
        <div
          className={`
          ${horizontalAlign ? "col-span-1" : "col-span-2"} p-2 mb-3
          `}
        >
          <label className={labelStyle}>{label}</label>

          <p className="mt-2 text-sm">{placeHolder}</p>

          <Dropdown
            // classNames={{
            //   base: "before:bg-default-200", // change arrow background
            //   content: "p-0 border-small border-divider bg-background",
            // }}
            className="w-full"
          >
            <DropdownTrigger disabled={viewOnly} className="w-full">
              <p className="border text-black text-base mt-2 border-gray-200 px-3 py-2 flex items-center justify-between rounded-lg">
                {field?.response ? field?.response : "No option selected"}
                <IoIosArrowDown />
              </p>
            </DropdownTrigger>
            <DropdownMenu
              selectionMode="single"
              aria-label="Dynamic Actions"
              className="bg-white shadow-sm rounded-lg w-60"
            >
              {field.choiceValues.map((value: any) => {
                return (
                  <DropdownItem
                    key={value}
                    onClick={() =>
                      saveSingleResponse(section?.id, field?.id, value)
                    }
                    className="flex hover:bg-gray-100 px-4  items-center flex-row gap-2"
                  >
                    <p className="text-base">{value}</p>
                  </DropdownItem>
                );
              })}
            </DropdownMenu>
          </Dropdown>
        </div>
      );

    case "checkboxes":
      return (
        <div
          className={`
          ${horizontalAlign ? "col-span-1" : "col-span-2"} p-2 mb-3
          `}
        >
          <label className={labelStyle}>{label}</label>
          <p className="mt-2 text-sm">{placeHolder}</p>

          <div className=" text-black px-3 py-2 grid grid-cols-2 gap-x-4 gap-y-1">
            {field.choiceValues.map((value: any) => {
              return (
                <div className="flex  items-center flex-row gap-2">
                  <input
                    disabled={viewOnly}
                    // checked={Boolean(field?.response !== null)}
                    onChange={(e) =>
                      saveSingleResponse(section?.id, field?.id, e.target.value)
                    }
                    key={value}
                    value={value}
                    type="checkbox"
                  />

                  <p className="text-base">{value}</p>
                </div>
              );
            })}
          </div>
        </div>
      );

    case "upload":
      return (
        <div
          className={`
          ${horizontalAlign ? "col-span-1" : "col-span-2"} p-2 
          `}
        >
          <label className="font-sm text-gray-400 mb-2">
            {label ? label : "No label"}
          </label>
          <div className="border text-gray-400 mt-2 border-gray-200 p-7 my-4 flex items-center justify-center flex-col gap-1 text-center text-sm rounded-lg">
            <LuUploadCloud size={32} />
            {placeHolder}
            <p className="text-xs font-light text-gray-500">
              Supported formats: PNG, JPEG, PDF (5MB max file size)
            </p>
            <button className="border border-gray-100 shadow px-3 py-1 rounded-lg mt-5">
              Select files{" "}
            </button>
          </div>
        </div>
      );
  }
}

export default FormFieldValue;
