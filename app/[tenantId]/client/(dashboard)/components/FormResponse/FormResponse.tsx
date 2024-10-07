import React, { forwardRef, useEffect } from "react";
import "./index.css";
import { PhoneSelector } from "@/components/PhoneSelector/PhoneSelector";

type Props = {
  mergedForm: any;
  onRendered?: any;
};

const renderFormResponse = (formField: any) => {
  switch (formField?.fieldDataType) {
    case "short-text":
      return (
        <input defaultValue={formField?.response} className="fit" readOnly disabled/>
      );
    case "email":
      return (
        <input defaultValue={formField?.response} className="fit" readOnly disabled/>
      );
    case "calendar":
      return (
        <input
          disabled
          defaultValue={formField?.response}
          className="fit"
          readOnly
        />
      );

    case "number":
      return (
        <input defaultValue={formField?.response} className="fit" readOnly disabled/>
      );
    case "checkboxes":
      return (
        <>
          <input defaultValue={formField?.response} className="fit" readOnly disabled/>
          <div className=" text-black px-3 py-2 grid grid-cols-3 gap-x-4 gap-y-1">
            {formField.choiceValue.map((value: any) => {
              // values user selected
              let selected =
                formField.response == null || formField.response == ""
                  ? []
                  : [...formField?.response?.split(",")];

              return (
                <div className="flex  items-center flex-row gap-2">
                  <input
                    className="form-check-input"
                    disabled
                    checked={selected.includes(value)}
                    key={value}
                    value={value}
                    type="checkbox"
                  />

                  <p className="text-sm font-normal text-slate-700">{value}</p>
                </div>
              );
            })}
          </div>
        </>
      );
    case "dropdown":
      return (
        <>
          <input defaultValue={formField?.response} className="fit" readOnly disabled/>
          <div className="mt-2 grid grid-cols-3 gap-x-4 gap-y-1 w-full">
            {formField?.choiceValue?.map((option: any, index: number) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="radio"
                  className=""
                  checked={option == formField?.response}
                  disabled
                />
                <div className="text-sm font-normal text-slate-700">
                  {option}
                </div>
              </div>
            ))}
          </div>
        </>
      );
    case "phone":
      return (
        <PhoneSelector
          phone={
            formField?.response?.charAt(0) == 0
              ? formField?.response?.replace("0", "233")
              : formField?.response
          }
          disabled={true}
          hideDropdown={true}
          display="none"
        />
      );

    case "long-text":
      return <textarea className=" big-fit" readOnly disabled>{formField?.response}</textarea>;

    default:
      return (
        <input defaultValue={formField?.response} className="fit" readOnly disabled/>
      );
  }
};
const FormResponse = forwardRef(function FormResponse(
  { mergedForm, onRendered = () => {} }: Props,
  ref: any
) {
  useEffect(() => {
    if (onRendered) {
      onRendered();
    }
  }, [onRendered]);

  const formSections = mergedForm?.formSections;
  return (
    <div className="w-full " ref={ref}>
      {formSections?.filter((section: any) => section?.isDeleted !== true)?.map((section: any, index: number) => (
        <div className="bg-white rounded-lg mb-4 w-full px-4 py-5" key={index} id={index > 0 ? "newsection" : "firstsection"}>
          <div className=" text-slate-900 font-semibold text-lg my-2">
            {section?.name}
          </div>
          <div className="form-container">
            {section?.formFields?.map((formField: any, index: number) => {
              const isHorizontalAlign = formField?.horizontalAlign;

              const itemClass = isHorizontalAlign ? "half-width" : "full-width";
              if (formField?.fieldDataType !== "upload") {
                return (
                  <div className={itemClass} key={index}>
                    <div className={"response-input"}>
                      <div className="label">{formField?.label}</div>
                      {renderFormResponse(formField)}
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      ))}
    </div>
  );
});

export default FormResponse;
