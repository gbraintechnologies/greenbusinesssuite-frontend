"use client";

import useClientForm from "@/hooks/useClientForm";

import formatBytes from "@/utils/FormatBytes/formatBytes";

//
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";

// icons
import { IoCloseCircleOutline } from "react-icons/io5";

import { IoIosArrowDown } from "react-icons/io";
import { LuUploadCloud } from "react-icons/lu";
import { CiCircleInfo } from "react-icons/ci";

//
import { toast } from "sonner";
import { PhoneSelector } from "@/components/PhoneSelector/PhoneSelector";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";

function FormFieldValue({ field, section, viewOnly }: any) {
  // functions
  const {
    saveSingleResponse,
    storeUploadedFile,
    setFilesToSubmit,
    removeStoredFile,
  } = useClientForm();

  //
  const { fieldDataType, horizontalAlign, placeHolder, label, maxLength } =
    field;

  // for file uploads
  const [selectedFiles, setSelectedFiles] = useState([]);

  // set all files in both files to submit and selected files to null when new here
  useEffect(() => {
    setFilesToSubmit([]);
    setSelectedFiles([]);
  }, []);

  const onDrop = useCallback((acceptedFiles: any, fileRejections: any) => {
    // @ts-ignore
    setSelectedFiles((prev) => [...prev, ...acceptedFiles]);

    storeUploadedFile(acceptedFiles);

    // show errors for rejected files
    fileRejections.map(({ file, errors }: any) => {
      for (const error of errors) {
        if (error.code === "file-too-large") {
          toast.error(`${file.name} is larger than 1Mb`);
        }

        if (error.code === "file-invalid-type") {
          toast.error(
            `${file.name} is invalid and doesn't meet upload criteria`
          );
        }
      }
    });
  }, []);

  //
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 1048576,
    accept: {
      // 'image/jpeg': ['.jpeg', '.png']
    },
  });

  // TYPES
  // text
  // integer
  // string
  // email
  // phone

  // calendar

  // main styles

  const [phone, setPhone] = useState(null);

  const { data: jurisdictions, isLoading: jurisdictionsLoading } = useQuery({
    queryKey: ["all jurisdictions"],
    queryFn: services.allJurisdictions(),
    enabled: Boolean(field?.instruction === "country-only"),
  });

  // getJurisdictionEntriesById
  const { data: jurisdictionEntries, isLoading: jurisdictionEntriesLoading } =
    useQuery({
      queryKey: ["all parentSchemeEntries", field?.validPattern],
      queryFn: services.getJurisdictionById(Number(field?.validPattern)),
      enabled: !!field?.validPattern,
    });

  useEffect(() => {
    if (fieldDataType === "phone") {
      saveSingleResponse(section?.id, field?.id, phone);
    }
  }, [phone]);

  const inputStyle = `border-[0.7px] w-full  text-black bg-white placeholder:text-gray-400 mt-2 border-gray-200 px-3 py-2 rounded-lg`;
  const labelStyle = `font-sm text-gray-400`;

  switch (fieldDataType) {
    case "address":
      const { instruction, validPattern } = field;

      // SELECTING A COUNTRY ONLY
      if (instruction === "country-only") {
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
                  {field?.response ? field?.response : "No country selected"}
                  <IoIosArrowDown />
                </p>
              </DropdownTrigger>
              <DropdownMenu
                selectionMode="single"
                aria-label="Dynamic Actions"
                className="bg-white shadow-sm rounded-lg w-60"
              >
                {jurisdictions?.content?.map((value: any) => {
                  return (
                    <DropdownItem
                      key={value}
                      onClick={() =>
                        saveSingleResponse(section?.id, field?.id, value?.name)
                      }
                      className="flex hover:bg-gray-100 px-4  items-center flex-row gap-2"
                    >
                      <p className="text-base">{value?.name}</p>
                    </DropdownItem>
                  );
                })}
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      }

      // SELECTING PARENT AND SUB LEVEL OF A COUNTRY
      if (instruction === "parent-and-sub-level") {
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
                  {field?.response?.split(",")[0]
                    ? field?.response?.split(",")[0]
                    : "Select option"}
                  <IoIosArrowDown />
                </p>
              </DropdownTrigger>
              <DropdownMenu
                selectionMode="single"
                aria-label="Dynamic Actions"
                className="bg-white shadow-sm rounded-lg w-60"
              >
                {jurisdictionEntries?.parentAddressScheme?.entries?.map(
                  (value: any) => {
                    return (
                      <DropdownItem
                        key={value}
                        onClick={() =>
                          saveSingleResponse(
                            section?.id,
                            field?.id,
                            value?.name
                          )
                        }
                        className="flex hover:bg-gray-100 px-4  items-center flex-row gap-2"
                      >
                        <p className="text-base">{value?.name}</p>
                      </DropdownItem>
                    );
                  }
                )}
              </DropdownMenu>
            </Dropdown>

            {field?.response && (
              <Dropdown isDisabled={viewOnly} className="w-full">
                <DropdownTrigger disabled={viewOnly} className="w-full">
                  <p className="border text-black text-base mt-2 border-gray-200 px-3 py-2 flex items-center justify-between rounded-lg">
                    {field?.response?.split(",")[1]
                      ? field?.response?.split(",")[1]
                      : "Select sub level"}
                    <IoIosArrowDown />
                  </p>
                </DropdownTrigger>
                <DropdownMenu
                  selectionMode="single"
                  aria-label="Dynamic Actions"
                  className="bg-white shadow-sm rounded-lg w-60"
                >
                  {jurisdictionEntries?.parentAddressScheme?.entries
                    ?.find(
                      (item: any) => item.name == field?.response.split(",")[0]
                    )
                    .childEntries?.map((value: any) => {
                      return (
                        <DropdownItem
                          key={value}
                          onClick={() =>
                            saveSingleResponse(
                              section?.id,
                              field?.id,
                              field?.response + "," + value?.name
                            )
                          }
                          className="flex hover:bg-gray-100 px-4  items-center flex-row gap-2"
                        >
                          <p className="text-base">{value?.name}</p>
                        </DropdownItem>
                      );
                    })}
                </DropdownMenu>
              </Dropdown>
            )}
          </div>
        );
      }

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
            maxLength={field?.maxLength}
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
          <MaxLengthCounter field={field} />
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
          <label className={labelStyle}>
            {label} <MandatoryLabel field={field} />
          </label>
          <input
            maxLength={field?.maxLength}
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
          <MaxLengthCounter field={field} />
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
            onBlur={(e) =>
              saveSingleResponse(section?.id, field?.id, e.target.value)
            }
            disabled={viewOnly}
            type="email"
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
          <label className={labelStyle}>
            {label} <MandatoryLabel field={field} />
          </label>
          {/* <input
            type="number"
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
          /> */}
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

          <Dropdown
            isDisabled={viewOnly}
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
          <label className={labelStyle}>
            {label} <MandatoryLabel field={field} />
          </label>
          <p className="mt-2 text-sm">{placeHolder}</p>

          <div className=" text-black px-3 py-2 grid grid-cols-3 gap-x-4 gap-y-1">
            {field.choiceValues.map((value: any) => {
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
                    onChange={(e) => {
                      // speical case for checkboxes - using comma to store all values in string

                      let update = selected;

                      if (update.includes(value)) {
                        update = update.filter(
                          (item) => item !== e.target.value
                        );
                      } else {
                        update.push(value);
                      }

                      saveSingleResponse(
                        section?.id,
                        field?.id,
                        update.join(",")
                      );
                    }}
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
            onBlur={(e) =>
              saveSingleResponse(section?.id, field?.id, e.target.value)
            }
            disabled={viewOnly}
            value={field?.response}
            onChange={(e) =>
              saveSingleResponse(section?.id, field?.id, e.target.value)
            }
            className="block mt-2 w-full border-gray-400 text-gray-500 border px-3 py-2 rounded-lg"
            placeholder={placeHolder ? placeHolder : "No placeholder specified"}
            type="date"
          />
        </div>
      );

    case "upload":
      return (
        <>
          <div>
            <label className="font-sm text-gray-400 mb-2">
              {label ? label : "No label"}
            </label>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <div className="border text-gray-400 mt-2 border-gray-200 p-7 my-4 flex items-center justify-center flex-col gap-1 text-center text-sm rounded-lg">
                <LuUploadCloud size={32} />
                {placeHolder}
                <p className="text-xs font-light text-gray-500">
                  Supported formats: PNG, JPEG, PDF (1MB max file size)
                </p>
                <button className="border  hover:text-black border-gray-100 shadow px-3 py-1 rounded-lg mt-5">
                  Select file(s){" "}
                </button>
              </div>
            </div>

            {/*  */}
            {selectedFiles?.length > 0 && (
              <div>
                <div className="my-4 text-gray-500 font-light">
                  Selected Files
                </div>
                <div className="grid grid-cols-2 gap-4 mb-5">
                  {selectedFiles?.map((file: any) => {
                    return (
                      <div className="flex gap-4 bg-gray-100 p-2 pl-3 justify-between rounded-lg">
                        <div className="flex flex-col">
                          <p className="font-semibold text-sm">{file?.name}</p>
                          <p className="text-xs text-gray-600">
                            {formatBytes(file?.size)}
                          </p>
                        </div>
                        <IoCloseCircleOutline
                          size={20}
                          className="text-gray-500 w-10 hover:text-black cursor-pointer"
                          onClick={() => {
                            removeStoredFile(file);
                            setSelectedFiles((prev) => [
                              ...prev.filter(
                                (item: any) => item.name !== file.name
                              ),
                            ]);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* INFO NOTICE ON HOW FILES ARE HANDLES / PROCESSED */}
          <div className="bg-red-50 p-3 rounded-lg text-lg flex flex-row gap-3 mb-10">
            <CiCircleInfo size={40} />{" "}
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

const MaxLengthCounter = ({ field }: any) => {
  return (
    <>
      {!!field?.maxLength && (
        <div className="flex justify-between items-center text-xs font-light text-gray-60 mt-1 px-2">
          <p className="0">
            Limit is{" "}
            <span className="font-semibold">{field?.maxLength} characters</span>
          </p>
          {field?.maxLength === field?.response?.length ? (
            <p className="text-red-600">
              Limit reached{" "}
              <span className="font-semibold">{field?.response?.length}</span>
            </p>
          ) : (
            <>
              <p className="">
                Count{" "}
                <span className="font-semibold">{field?.response?.length}</span>
              </p>
            </>
          )}
        </div>
      )}
    </>
  );
};

const MandatoryLabel = ({ field }: any) => {
  return (
    <div className="inline-block">
      {field?.isMandatory && <span className="text-red-400 font-light">*</span>}
    </div>
  );
};

export default FormFieldValue;
