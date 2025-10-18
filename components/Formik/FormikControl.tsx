"use client";

import React from "react";

// components
import Input from "./components/Input";
import Select from "./components/Select";
import Textarea from "./components/TextArea";
import DatePicker from "./components/DatePicker";
import CheckboxGroup from "./components/CheckboxGroup";
import SingleCheckbox from "./components/SingleCheckbox";

//
interface FormikControlProps {
  control:
    | "checkbox"
    | "select"
    | "input"
    | "textarea"
    | "date"
    | "text"
    | "single-checkbox";
  isRequired?: boolean;
  label?: string;
  name: string;
  type: "number" | "text" | "date" | "email" | "password";
  options?: any;
  style?: any;
  isDisabled?: boolean;
  [key: string]: any;
}

function FormikControl(props: FormikControlProps) {
  const { control, ...rest } = props;
  switch (control) {
    case "input":
      return <Input {...rest} />;
    case "textarea":
      return <Textarea {...rest} />;
    case "select":
      return <Select {...rest} />;
    // case "radio":
    //   return <RadioButtons {...rest} />;
    case "checkbox":
      return <CheckboxGroup {...rest} />;

    case "single-checkbox":
      return <SingleCheckbox {...rest} />;
    case "date":
      return <DatePicker {...rest} />;
    default:
      return null;
  }
}

export default FormikControl;

// https://github.com/gopinav/React-Formik-Tutorials/tree/master/formik-controls-demo/src/components
