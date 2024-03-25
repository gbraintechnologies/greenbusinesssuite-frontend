import React from "react";
import { Field, useField } from "formik";

interface CustomCheckboxProps {
  name: string;
  label: string;
  subtext: string;
}

// CustomCheckbox component
export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  name,
  label,
  subtext,
}) => {
  const [field, , helpers] = useField(name);

  return (
    <label
      htmlFor={name}
      className="flex items-center h-20 rounded-md gap-4 bg-slate-50 px-5"
    >
      <div className="flex items-center h-5">
        <input
          id={name}
          {...field}
          type="checkbox"
          className="form-check-input"
          checked={field.value}
          onChange={(e) => helpers.setValue(e.target.checked)}
        />
      </div>
      <div className="flex flex-col">
        <p className="font-semibold text-slate-900">
          {label}
        </p>
        <p  className="text-sm text-slate-600">
          {subtext}
        </p>
      </div>
    </label>
  );
};
