"use client";

import React from "react";
import { Field } from "formik";

import { Checkbox } from "@heroui/react";

import { RequiredMarker, ShowError } from "@/components/Formik/formHelpers";

import "./index.css";

function SingleCheckbox(props: any) {
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
      <Field name={name}>
        {({ form, field }: { form: any; field: any }) => {
          const { setFieldValue } = form;
          const { value } = field;

          return (
            <div className="flex">
              <Checkbox
                isDisabled={isDisabled}
                value={value}
                onValueChange={(val) => {
                  setFieldValue(name, val);
                }}
              />
              <p>
                {" "}
                {label} {isRequired && <RequiredMarker />}
              </p>
            </div>
          );
        }}
      </Field>
      <ShowError name={name} />
    </div>
  );
}

export default SingleCheckbox;
