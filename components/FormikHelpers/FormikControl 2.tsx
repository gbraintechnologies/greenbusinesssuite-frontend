"use client";

import React from "react";

// components

import FormikSelect from "./FormikSelect";

function FormikControl(props: any) {
  const { control, ...rest } = props;
  switch (control) {
    // case "input":
    //   return <Input {...rest} />;
    // case "textarea":
    //   return <Textarea {...rest} />;
    case "select":
      return <FormikSelect {...rest} />;
    // case "radio":
    //   return <RadioButtons {...rest} />;
    // case "checkbox":
    //   return <CheckboxGroup {...rest} />;

    default:
      return null;
  }
}

export default FormikControl;

// https://github.com/gopinav/React-Formik-Tutorials/tree/master/formik-controls-demo/src/components
