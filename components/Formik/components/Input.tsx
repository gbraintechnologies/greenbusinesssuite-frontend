"use client";

import React from "react";
import { Field } from "formik";

import { RequiredMarker, ShowError } from "@/components/Formik/formHelpers";

function Input(props: any) {
  const { label, name, isRequired, isDisabled, ...rest } = props;
  return (
    <div className="holderStyle">
      <label htmlFor={name} className="labelStyle">
        {label} {isRequired && <RequiredMarker />}
      </label>
      <Field
        disabled={Boolean(isDisabled)}
        className="inputStyle"
        id={name}
        name={name}
        {...rest}
      />
      <ShowError name={name} />
    </div>
  );
}

export default Input;
