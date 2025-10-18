"use client";

import React from "react";
import { Field } from "formik";

import { RequiredMarker, ShowError } from "../formHelpers";

function Textarea(props: any) {
  const { label, name, isRequired, ...rest } = props;
  return (
    <div className="holderStyle">
      <label htmlFor={name} className="labelStyle">
        {label} {isRequired && <RequiredMarker />}
      </label>
      <Field
        className="inputStyle"
        as="textarea"
        id={name}
        name={name}
        {...rest}
      />
      <ShowError name={name} />
    </div>
  );
}

export default Textarea;
