import React from "react";
import "./index.css";
import { PhoneSelector } from "@/components/PhoneSelector/PhoneSelector";

type Props = {
  mergedForm: any;
};

const renderFormResponse = (formField: any) => {
  switch (formField?.fieldDataType) {
    case "short-text":
      return <input defaultValue={formField?.response} readOnly />;
    case "email":
      return <input defaultValue={formField?.response} readOnly />;
    case "number":
      return <input defaultValue={formField?.response} readOnly />;
    case "phone":
      return (
        <PhoneSelector
          phone={
            formField?.response.charAt(0) == 0
              ? formField?.response.replace("0", "233")
              : formField?.response
          }
          disabled={true}
        />
      );
    case "long-text":
      return <textarea defaultValue={formField?.response} readOnly />;
  }
};
const FormResponse = ({ mergedForm }: Props) => {
  const formSections = mergedForm?.formSections;
  return (
    <div className="w-[80%] ">
      {formSections?.map((section: any) => (
        <div className="bg-white rounded-lg mb-4 w-full px-4 py-5">
          <div className=" text-slate-900 font-semibold text-lg my-2">
            {section?.name}
          </div>
          <div className="form-container">
            {section?.formFields?.map((formField: any, index: number) => {
              const isHorizontalAlign = formField?.horizontalAlign;

              const itemClass = isHorizontalAlign ? "half-width" : "full-width";
              return (
                <div className={itemClass} key={index}>
                  <div className={"input-holder"}>
                    <div className="label">{formField?.label}</div>
                    {renderFormResponse(formField)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FormResponse;
