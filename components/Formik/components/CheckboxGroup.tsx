"use client";

import React from "react";
import { Field } from "formik";

import { CheckboxGroup as NextUICheckboxGroup, Checkbox } from "@heroui/react";

import { RequiredMarker, ShowError } from "@/components/Formik/formHelpers";

import "./index.css";

function CheckboxGroup(props: any) {
  const {
    label,
    name,
    options,
    isRequired,
    isDisabled,
    isMultipleSelect = false,
    placeholder,
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

          return (
            <NextUICheckboxGroup
              isDisabled={isDisabled}
              value={value ? value.split(",") : value}
              onValueChange={(val) => {
                setFieldValue(name, val.toString());
              }}
            >
              <div className="grid grid-cols-2 gap-4">
                {options &&
                  options?.map((option: any) => (
                    <Checkbox
                      isDisabled={isDisabled}
                      value={option.value}
                    >
                      {option.value}
                    </Checkbox>
                  ))}
              </div>
            </NextUICheckboxGroup>
          );
        }}
      </Field>
      <ShowError name={name} />
    </div>
  );
}

export default CheckboxGroup;
