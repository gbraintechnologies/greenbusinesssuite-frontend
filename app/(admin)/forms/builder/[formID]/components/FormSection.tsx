"use state";

import React, { useState } from "react";
import FormField from "./FormField";

// let sortByOrder = (data: any) => {
//   return data.sort(function (a: any, b: any) {
//     return a.ordering - b.ordering;
//   });
// };

function FormSection({ section }: any) {
  let [localSection, setLocalSection] = useState(section);

  return (
    <div className="bg-white min-h-72 shadow p-5 rounded-xl mb-10">
      <h5 className="font-bold text-lg">
        {" "}
        <input
          value={localSection?.name ? localSection?.name : "No seciton title"}
          className="outline-none focus:outline-none w-full"
          onChange={(e) => {}}
        />
      </h5>
      <p className="font-extralight text-sm mb-5">
        {" "}
        <input
          value={
            localSection?.description
              ? localSection?.description
              : "No section description provided"
          }
          className="outline-none focus:outline-none w-full"
          onChange={(e) => {}}
        />
      </p>
      <div className="grid grid-cols-2 gap-5">
        {localSection?.formFields?.map((field: any) => {
          return <FormField field={field} />;
        })}
      </div>

      <div
        className={`${
          localSection.formFields.length === 0
            ? "bg-[#F8FAFC] p-3 my-4 min-h-48  rounded-2xl "
            : " text-center mx-auto mt-5 w-full"
        } flex items-center justify-center`}
      >
        <button className="bg-white border text-sm shadow-sm hover:bg-black hover:text-white border-gray-200 px-3 py-2 rounded-lg flex items-center justify-center gap-2">
          Add form element
        </button>
      </div>
    </div>
  );
}

export default FormSection;
