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

import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteSection,
} from "@nextui-org/autocomplete";

// icons

import { IoIosArrowDown } from "react-icons/io";
import ChoiceValuesEditing from "./ChoiceValuesEditing";
import { capitalize } from "@mui/material";
import services from "@/services";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import AddressValues from "./AddressValues";

function FieldOptions({ refetch }: any) {
  const { activeField, updateActiveField, form } = useForm();

  let [localField, setLocalField] = useState(activeField?.field);

  const { data: formStatusCount } = useQuery({
    queryKey: ["Get forms status count"],
    queryFn: services.getFormStatusCountById(Number(form?.id)),
    enabled: Boolean(form?.id),
  });

  // address holding vairables
  const [selectedCountry, setSelectedCountry] = useState<any>(null);

  const { data: jurisdictions, isLoading: jurisdictionsLoading } = useQuery({
    queryKey: ["all jurisdictions"],
    queryFn: services.allJurisdictions(),
    enabled:
      Boolean(form?.id) && Boolean(localField?.fieldDataType === "address"),
  });

  console.log("jurisdictions", jurisdictions);

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

  const addressTypes = [
    { name: "Country only", value: "country-only" },
    { name: "Parent & Sub Level", value: "parent-and-sub-level" },
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
    const {
      isMandatory,
      label,
      maxLength,
      fieldDataType,
      validPattern,
      instruction,
      placeHolder,
      horizontalAlign,
    } = localField;

    // address input
    if (fieldDataType === "address") {
      return (
        <div className="bg-white hide-input-borders  pb-[25rem] h-screen no-scrollbar  overflow-y-scroll  p-3">
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

          {/* LABEL */}
          <div className="flex flex-col gap-5 my-5">
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
                onBlur={() =>
                  updateActiveField(activeField.section, localField)
                }
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
                onBlur={() =>
                  updateActiveField(activeField.section, localField)
                }
              />
            </div>
          </div>

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
              className={`${
                horizontalAlign ? "bg-primary-green" : "bg-gray-500"
              }
          relative inline-flex h-[24px] w-[48px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`}
            >
              <span
                aria-hidden="true"
                className={`${
                  horizontalAlign ? "translate-x-6" : "translate-x-0"
                }
            pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
              />
            </Switch>
          </div>

          {/* ADDRESS TYPE */}
          <div className="mt-5">
            <p className="font-medium text-base mb-4">Address Selection Type</p>{" "}
            <Dropdown>
              <DropdownTrigger>
                <button className="bg-white flex items-center justify-between border rounded-xl px-4 py-2 w-full text-left">
                  <span className="block truncate">
                    {instruction
                      ? capitalize(instruction).replace("-", " ")
                      : "No type selected"}
                  </span>

                  <IoIosArrowDown className="h-5 w-5 text-gray-600" size={20} />
                </button>
              </DropdownTrigger>
              <DropdownMenu
                className="shadow-md bg-white border border-[#F1F5F9] w-full rounded-lg flex flex-col gap-3"
                aria-label="Static Actions"
              >
                {addressTypes.map((type: any) => {
                  return (
                    <DropdownItem
                      key={type.id}
                      onClick={() => {
                        setLocalField((prev: any) => ({
                          ...prev,
                          instruction: type?.value,
                        }));
                        updateActiveField(activeField.section, {
                          ...localField,
                          instruction: type?.value,
                        });
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

          {/* COUNTRY SELECTION FOR USER ONLY */}
          {instruction === "country-only" && (
            <div className="mt-5">
              {/* <AddressValues values={jurisdictions?.content} /> */}
              <div className="flex text-sm gap-2 text-gray-600">
                <CiCircleInfo size={30} />{" "}
                <span>
                  Users would be allowed to select a country only from the
                  countries set up
                </span>
              </div>
            </div>
          )}

          {/* PARENT LEVEL SELECTION FOR USER  */}
          {instruction == "parent-and-sub-level" && (
            <>
              {/* COUNTRY */}
              <div className="mt-5 mb-5">
                <p className="font-medium text-base mb-4">Country</p>{" "}
                {/* <Dropdown>
                  <DropdownTrigger>
                    <button className="bg-white flex items-center justify-between border rounded-xl px-4 py-2 w-full text-left">
                      <span className="block truncate">
                        {validPattern ? (
                          <>
                            {
                              jurisdictions?.content?.find(
                                (item: any) => item?.id == validPattern
                              ).name
                            }
                          </>
                        ) : (
                          "No country selected"
                        )}
                      </span>

                      <IoIosArrowDown
                        className="h-5 w-5 text-gray-600"
                        size={20}
                      />
                    </button>
                  </DropdownTrigger>
                  <DropdownMenu
                    className="shadow-md bg-white border border-[#F1F5F9] w-full rounded-lg flex flex-col gap-3"
                    aria-label="Static Actions"
                  >
                    {jurisdictions?.content.map((type: any) => {
                      return (
                        <DropdownItem
                          key={type.id}
                          onClick={() => {
                            setLocalField((prev: any) => ({
                              ...prev,
                              validPattern: type?.id,
                            }));
                            updateActiveField(activeField.section, {
                              ...localField,
                              validPattern: type?.id,
                            });
                          }}
                          className="items-center w-72 p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
                        >
                          {type?.name}
                        </DropdownItem>
                      );
                    })}
                  </DropdownMenu>
                </Dropdown> */}
                <Autocomplete
                  variant="flat"
                  className="bg-white flex items-center justify-between shadow-none border rounded-xl px-2 w-full text-left"
                  placeholder={
                    jurisdictions?.countries?.find(
                      (item: any) => item?.countryId == validPattern
                    )?.countryName || "No country selected"
                  }
                  scrollShadowProps={{
                    isEnabled: false,
                  }}
                  onSelectionChange={(type: any) => {
                    setLocalField((prev: any) => ({
                      ...prev,
                      validPattern: type?.countryId,
                    }));
                    updateActiveField(activeField.section, {
                      ...localField,
                      validPattern: type?.countryId,
                    });
                  }}
                >
                  <AutocompleteSection className="shadow-md bg-white border border-[#F1F5F9] rounded-lg w-full flex flex-col gap-3">
                    {jurisdictions?.countries.map((type: any) => (
                      <AutocompleteItem
                        key={type?.countryId}
                        value={type?.countryId}
                        className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
                      >
                        {type?.countryName}
                      </AutocompleteItem>
                    ))}
                  </AutocompleteSection>
                </Autocomplete>
              </div>

              {selectedCountry && (
                <div className="flex text-sm gap-2 text-gray-600">
                  <CiCircleInfo size={30} />{" "}
                  <span>
                    Users would be allowed to select the parent level and sub
                    level of {capitalize(selectedCountry?.name)}
                  </span>
                </div>
              )}

              {/* <AddressValues
                loading={jurisdictionEntriesLoading}
                values={jurisdictionEntries?.parentAddressScheme?.entries}
              /> */}
            </>
          )}

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
                Delete form element
              </button>
            </div>
          )}
        </div>
      );
    }

    // other kinds of input

    return (
      <div className="bg-white  pb-[25rem] h-screen no-scrollbar  overflow-y-scroll  p-3">
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

        {/* LABEL */}
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

        {/* MAX LENGTH FOR TEXT INPUTS */}
        {fieldDataType?.includes("text") && (
          <div className="flex flex-col gap-3">
            <label className={labelStyle}>Character limit</label>
            <input
              value={!!maxLength ? maxLength : 0}
              type="number"
              min={0}
              placeholder="Max length"
              className={inputStyle}
              onChange={(e) => {
                setLocalField((prev: any) => ({
                  ...prev,
                  maxLength: Number(e.target.value),
                }));
                updateActiveField(activeField.section, {
                  ...localField,
                  maxLength: Number(e.target.value),
                });
              }}
              onBlur={() => updateActiveField(activeField.section, localField)}
            />
          </div>
        )}

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
              Delete form element
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default FieldOptions;
