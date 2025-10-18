"use client";

import React from "react";
import { Field } from "formik";
import {
  Autocomplete,
  AutocompleteItem,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";

import { RequiredMarker, ShowError } from "@/components/Formik/formHelpers";

function Select(props: any) {
  const {
    label,
    name,
    options,
    isRequired,
    isMultipleSelect = false,
    placeholder,
    isDisabled,
    ...rest
  } = props;
  return (
    <div className="holderStyle">
      <label htmlFor={name} className="labelStyle">
        {label} {isRequired && <RequiredMarker />}
      </label>

      <Field name={name}>
        {({ form, field }: { form: any; field: any }) => {
          const { setFieldValue } = form;
          const { value } = field;

          if (isMultipleSelect) {
            return (
              <Dropdown>
                <DropdownTrigger>
                  <div className="w-full border px-4 py-2  rounded-lg">
                    {value ? value : placeholder}
                  </div>
                </DropdownTrigger>
                <DropdownMenu
                  classNames={{
                    list: "w-[72vw] md:w-[40vw]",
                  }}
                  disallowEmptySelection
                  closeOnSelect={false}
                  selectionMode="multiple"
                  onSelectionChange={(value) => {
                    setFieldValue(name, Array.from(value).join(", "));
                  }}
                >
                  {options &&
                    options?.map((option: any) => (
                      <DropdownItem key={option.key}>
                        {" "}
                        {option.value}
                      </DropdownItem>
                    ))}
                </DropdownMenu>
              </Dropdown>
            );
          }
          // NORMAL SEARCH AND SELECT

          return (
            <Autocomplete
              placeholder={placeholder}
              isClearable={true}
              isDisabled={isDisabled}
              className="w-full border rounded-lg"
              value={value}
              defaultSelectedKey={value && value}
              scrollShadowProps={{
                isEnabled: false,
              }}
              onInputChange={(value) => {
                setFieldValue(name, value);
              }}
            >
              {options &&
                options?.map((option: any) => (
                  <AutocompleteItem key={option.value}>
                    {option.key}
                  </AutocompleteItem>
                ))}
            </Autocomplete>
          );
        }}
      </Field>
      <ShowError name={name} />
    </div>
  );
}

export default Select;
