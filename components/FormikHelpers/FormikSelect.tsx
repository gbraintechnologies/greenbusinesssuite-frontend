"use client";

import React from "react";
import { Field } from "formik";
import { AutocompleteItem, Autocomplete } from "@heroui/autocomplete";

import "./index.css";
function FormikSelect(props: any) {
  const {
    label,
    name,
    options,
    isRequired,
    disabled,
    placeholder,
    style,
    ...rest
  } = props;

  return (
    <div className="holderStyle">
      <label htmlFor={name} className="labelStyle">
        {label}
      </label>

      <Field name={name}>
        {({ form, field }: { form: any; field: any }) => {
          const { setFieldValue } = form;
          const { value } = field;
          return (
            <Autocomplete
              style={{
                border: "0px solid none",
              }}
              variant="bordered"
              isDisabled={disabled}
              classNames={{
                base:
                  style.border == "1px solid #FF2828" &&
                  "border border-[#FF2828]",
              }}
              placeholder={placeholder}
              isClearable={false}
              className="w-full outline-none border-0 rounded-lg"
              value={value}
              onInputChange={(value) => {
                setFieldValue(name, value);
              }}
            >
              {options &&
                options?.map((option: any) => (
                  <AutocompleteItem key={option.key}>
                    {option.value}
                  </AutocompleteItem>
                ))}
            </Autocomplete>
          );
        }}
      </Field>
    </div>
  );
}

export default FormikSelect;
