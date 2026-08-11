"use client";

import React, { ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** HeroUI-style press handler — mapped to onClick */
  onPress?: (e?: any) => void;
  isDisabled?: boolean;
  isLoading?: boolean;
};

const CompanyThemedButton = forwardRef<HTMLButtonElement, Props>(
  function CompanyThemedButton(
    {
      className,
      children,
      onPress,
      onClick,
      isDisabled,
      isLoading,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) {
    const isBusy = Boolean(isLoading);
    const isInactive = Boolean(disabled || isDisabled || isBusy);

    return (
      <button
        ref={ref}
        type={type}
        disabled={isInactive}
        onClick={(event) => {
          if (isInactive) return;
          onClick?.(event);
          onPress?.(event);
        }}
        className={clsx(
          "inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 hover:opacity-95 disabled:cursor-not-allowed disabled:bg-gray-400",
          className
        )}
        {...props}
      >
        {isBusy && (
          <AiOutlineLoading3Quarters className="animate-spin" size={16} />
        )}
        {children}
      </button>
    );
  }
);

export default CompanyThemedButton;
