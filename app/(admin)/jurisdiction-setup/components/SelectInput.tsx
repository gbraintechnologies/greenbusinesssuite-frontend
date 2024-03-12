import clsx from "clsx";
import React from "react";
import { IconType } from "react-icons";

interface Country {
  cca2: string;
  name: {
    common: string;
    official: string;
  };
  flags: {
    png: string;
    svg: string;
  };
}



interface ISelectInput extends React.InputHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value?: string | number | undefined;
  name?: string;
  id?: string;
  listdata: Country[];
  PrependIcon?: React.ReactNode;
  PostpendIcon?: React.ReactNode;
  extraClasses?: string;
  btnSize?: "normal" | "small";
  optional?: boolean;
}

const SelectInput = React.forwardRef<HTMLSelectElement, ISelectInput>(
  ({ ...props }, forwardedRef) => {
    const {
      label,
      error,
      helperText,
      required,
      disabled,
      PrependIcon,
      PostpendIcon,
      id,
      extraClasses,
      optional,
      listdata,
      btnSize = "normal",
      ...rest
    } = props;

    return (
      <div className="flex flex-col w-full">
        {label && (
          <label htmlFor={id} className="font-medium text-slate-700 text-sm">
            {label}{" "}
            {optional && <span className="text-slate-400">(Optional)</span>}
            {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="relative">

          {PrependIcon && (
            <div className="inset-y-0 mt-1 left-0 flex items-center justify-center pl-3 pr-3 pointer-events-none">
              {PrependIcon}
            </div>
          )}

          <select
            id={id}
            disabled={disabled}
            ref={forwardedRef}
            {...rest}
            className={clsx(
              error ? "border border-red-500" : "",
              PostpendIcon ? "pr-10" : "",
              PrependIcon ? "pl-20" : "",
              btnSize === "normal" ? "h-[46px]" : "h-[40px]",
              `focus:ring-0 border border-slate-300 focus:border focus:border-teal-600 rounded-[6px] mb-1 mt-[7px] outline-none focus:outline-none w-full px-4 py-3 font-medium text-slate-900 ${extraClasses}`
            )}
          >
             <option value="">Select Country</option>
            {listdata.map(country =>
              <option value={country?.cca2}>{country?.name.common}</option>
            )}
          </select>

          {PostpendIcon && (
            <div className="absolute inset-y-0 mt-1 right-0 flex items-center justify-center pr-3 pointer-events-none">
              {PostpendIcon}
            </div>
          )}
        </div>
        {helperText && <p className="text-sm text-slate-500">{helperText}</p>}
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </div>
    );
  }
);

SelectInput.displayName = "SelectInput";

export default SelectInput;
