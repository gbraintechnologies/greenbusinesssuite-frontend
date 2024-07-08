import React from "react";
import FormFieldValue from "./FormFieldValue";

function FormSection({ section, viewOnly }: any) {
  const { name, formFields, description } = section;
  return (
    <div className="p-3">
      <div className="mb-5">
        <h4 className="text-2xl font-semibold">{name}</h4>
        <p className="mt-1 text-base font-light text-gray-600 ">
          {description}
        </p>
      </div>

      <div className="bg-white min-h-[10rem] p-5 rounded-lg">
        {formFields?.map((field: any) => {
          return (
            <FormFieldValue
              viewOnly={viewOnly}
              section={section}
              field={field}
            />
          );
        })}
      </div>
    </div>
  );
}

export default FormSection;
