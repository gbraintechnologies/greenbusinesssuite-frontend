import clsx from "clsx";
import React from "react";
import "../components/index.css";

interface IRadioInput extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string | number | undefined;
  name?: string;
  id?: string;
  extraClasses?: string;
}

const RadioInput = React.forwardRef<HTMLInputElement, IRadioInput>(
  (
    { label, error, helperText, required, disabled, id, extraClasses, ...rest },
    forwardedRef
  ) => {
    return (
      <div className="flex items-center">
        <div
          className={clsx(
            `focus:ring-0 border focus:border focus:border-black rounded-[6px] mb-1 mt-[7px] outline-none focus:outline-none w-full px-4 py-3 font-medium text-black-100 ${extraClasses}`
          )}
        >
          <label htmlFor={id} className="font-medium text-sm">
            <input
              id={id}
              type="radio"
              disabled={disabled}
              ref={forwardedRef}
              {...rest}
              className="mr-2 custom-radio-input"
            />
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        </div>

        {helperText && (
          <p className="text-sm text-green-500 ml-2">{helperText}</p>
        )}
        {error && <p className="text-red-500 text-xs ml-2">{error}</p>}
      </div>
    );
  }
);

RadioInput.displayName = "RadioInput";

export default RadioInput;
