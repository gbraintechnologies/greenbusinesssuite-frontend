"use client";

import formatBytes from "@/utils/FormatBytes/formatBytes";

//
import React, { useEffect, useState } from "react";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";

// icons
import { IoCloseCircleOutline } from "react-icons/io5";

import { IoIosArrowDown } from "react-icons/io";
import { LuCloudUpload } from "react-icons/lu";
import { CiCircleInfo } from "react-icons/ci";

//

import { PhoneSelector } from "@/components/PhoneSelector/PhoneSelector";

function FormFieldValue({ field, section, viewOnly }: any) {
  // functions

  //
  const { fieldDataType, horizontalAlign, placeHolder, label } = field;

  // for file uploads

  // set all files in both files to submit and selected files to null when new here

  // TYPES
  // text
  // integer
  // string
  // email
  // phone

  // calendar

  // main styles

  const [phone, setPhone] = useState(null);

  const inputStyle = `border-[0.7px] w-full  text-black bg-white placeholder:text-gray-400 mt-2 border-gray-200 px-3 py-2 rounded-lg`;
  const labelStyle = `font-sm text-gray-400`;

  switch (fieldDataType) {
    case "long-text":
      return (
        <div
          className={`
          ${horizontalAlign ? "col-span-1" : "col-span-2"} p-2  mb-3
          `}
        >
          <label className={labelStyle}>
            {label} <MandatoryLabel field={field} />
          </label>
          <textarea
            disabled={viewOnly}
            value={field?.response}
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
          <label className={labelStyle}>
            {label} <MandatoryLabel field={field} />
          </label>
          <input
            type="number"
            disabled={viewOnly}
            value={field?.response}
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
          <label className={labelStyle}>
            {label} <MandatoryLabel field={field} />
          </label>
          <input
            disabled={viewOnly}
            value={field?.response}
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
          <label className={labelStyle}>
            {label} <MandatoryLabel field={field} />
          </label>
          <input
            disabled={viewOnly}
            type="email"
            value={field?.response}
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
          <label className={labelStyle}>
            {label} <MandatoryLabel field={field} />
          </label>

          <PhoneSelector
            style={{ outline: "none" }}
            disabled={viewOnly}
            value={field?.response}
            setPhone={setPhone}
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
          <label className={labelStyle}>
            {label} <MandatoryLabel field={field} />
          </label>

          <p className="mt-2 text-sm">{placeHolder}</p>

          <Dropdown isDisabled={viewOnly} className="w-full">
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
              {field?.choiceValue &&
                field?.choiceValue?.map((value: any) => {
                  return (
                    <DropdownItem
                      key={value}
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
          <label className={labelStyle}>
            {label} <MandatoryLabel field={field} />
          </label>
          <p className="mt-2 text-sm">{placeHolder}</p>

          <div className=" text-black px-3 py-2 grid grid-cols-3 gap-x-4 gap-y-1">
            {field?.choiceValue &&
              field?.choiceValue?.map((value: any) => {
                // values user selected
                let selected =
                  field.response == null || field.response == ""
                    ? []
                    : [...field?.response?.split(",")];

                return (
                  <div className="flex  items-center flex-row gap-2">
                    <input
                      className="form-check-input"
                      disabled={viewOnly}
                      checked={selected.includes(value)}
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

    case "calendar":
      return (
        <div
          className={`${horizontalAlign ? "col-span-1" : "col-span-2"} p-2 mb-3 
          `}
        >
          <label className="font-sm text-gray-400">
            {label ? label : "No label"}
          </label>

          <input
            disabled={viewOnly}
            value={field?.response}
            className="block mt-2 w-full border-gray-400 text-gray-500 border px-3 py-2 rounded-lg"
            placeholder={placeHolder ? placeHolder : "No placeholder specified"}
            type="date"
          />
        </div>
      );

    case "upload":
      return (
        <>
          <div
            className={`
  
          ${horizontalAlign ? "col-span-1" : "col-span-2"} p-2 
          `}
          >
            <label className="font-sm text-gray-400 mb-2">
              {label ? label : "No label"}
            </label>
            <div className="border text-gray-400 mt-2 border-gray-200 p-7 my-4 flex items-center justify-center flex-col gap-1 text-center text-sm rounded-lg">
              <LuCloudUpload size={32} />
              {placeHolder ? placeHolder : "No placeholder specified"}
              <p className="text-xs font-light text-gray-500">
                Supported formats: PNG, JPEG, PDF (1MB max file size)
              </p>
              <button className="border border-gray-100 shadow px-3 py-1 rounded-lg mt-5">
                Select files{" "}
              </button>
            </div>
          </div>

          {/* INFO NOTICE ON HOW FILES ARE HANDLES / PROCESSED */}
          <div className="bg-red-50 p-3 rounded-lg text-lg flex flex-row gap-3 mb-10">
            <CiCircleInfo size={15} />{" "}
            <p className="text-xs font-light italic">
              Selected file(s){" "}
              <span className="font-bold">
                would only be uploaded when the entire form is submitted.{" "}
              </span>
              Saving the progress of the form would not save the selected
              file(s).
            </p>
          </div>
        </>
      );
  }
}

const MandatoryLabel = ({ field }: any) => {
  return (
    <div className="inline-block">
      {field?.isMandatory && <span className="text-red-400 font-light">*</span>}
    </div>
  );
};

export default FormFieldValue;
