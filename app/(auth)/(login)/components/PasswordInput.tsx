import clsx from "clsx";
import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

interface IPasswordInput extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  name?: string;
  placeholder?: string;
  id?: string;
  extraClasses?: string;
  btnSize?: "normal" | "small";
  optional?: boolean;
}

const PasswordInput = React.forwardRef<HTMLInputElement, IPasswordInput>(
  ({ ...props }, forwardedRef) => {
    const {
      label,
      error,
      helperText,
      required,
      disabled,
      placeholder,
      id,
      extraClasses,
      optional,
      btnSize = "normal",
      ...rest
    } = props;

    const [showPassword, setShowPassword] = useState(false);

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
          <input
            id={id}
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete="off"
            ref={forwardedRef}
            {...rest}
            className={clsx(
              "border",
              error ? "border-red-500" : "border-gray-300",
              btnSize === "normal" ? "h-[46px]" : "h-[40px]",
              `focus:ring-0 pr-10 border border-slate-300 focus:border focus:border-teal-600 rounded-[6px] mb-1 mt-[7px] outline-none focus:outline-none w-full px-4 py-3 font-medium text-slate-900 ${extraClasses}`
            )}
          />
          <div
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 mt-1 right-0 flex items-center cursor-pointer justify-center pr-3"
          >
            {showPassword ? (
              <AiOutlineEyeInvisible className="h-5 w-5 text-slate-500" />
            ) : (
              <AiOutlineEye className="h-5 w-5 text-slate-500" />
            )}
          </div>
        </div>
        {helperText && <p className="text-sm text-slate-500">{helperText}</p>}
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;