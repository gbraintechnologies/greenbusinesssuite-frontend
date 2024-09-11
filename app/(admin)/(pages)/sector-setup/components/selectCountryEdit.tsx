import React from "react";
import { Countrie } from "./Countries"; // Ensure Countrie import is correct

interface ISelectCountryEdit
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  options: string[]; // Define the type for options
  selectedCountry?: string; // New prop to receive the selected country code
  readOnly?: boolean; // Prop for readonly mode
  PrependIcon?: React.ReactNode; // Define PrependIcon prop
}

const SelectCountryEdit: React.FC<ISelectCountryEdit> = ({
  label,
  error,
  helperText,
  required,
  options,
  selectedCountry,
  readOnly = false,
  PrependIcon,
  ...rest
}) => (
  <div className="flex flex-col w-full">
    {label && (
      <label className="font-medium text-slate-700 text-sm">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <div className="relative">
      <select
        {...rest}
        disabled={readOnly}
        className={`focus:ring-0 border border-slate-300 focus:border focus:border-black rounded-[6px] mb-1 mt-[7px] outline-none focus:outline-none w-full px-4 py-3 font-medium text-slate-900 ${
          error ? "border-red-500" : ""
        } ${
          readOnly ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "" // Adding gray color for readonly mode
        }`}
      >
        <option value="">Select Country</option>
        {options.map((option) => (
          <option key={option} value={option}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {option}
          </option>
        ))}
      </select>
      {/* PrependIcon for flag */}
      {PrependIcon !== undefined && ( // Check if PrependIcon is defined
        <span className="absolute left-0 top-2 bottom-0 flex items-center pl-2">
          {PrependIcon}
        </span>
      )}
    </div>
    {helperText && <p className="text-sm text-slate-500">{helperText}</p>}
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);

export default SelectCountryEdit;
