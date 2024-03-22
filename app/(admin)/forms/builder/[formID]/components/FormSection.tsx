"use state";

import React, { useState } from "react";

function FormSection({ section }: any) {
  console.log("section", section);

  let [localSection, setLocalSection] = useState(section);

  return (
    <div className="bg-white min-h-72 shadow p-5 rounded-xl mb-10">
      <h5 className="font-bold text-lg">Section heading</h5>
      <p className="font-light text-sm">Form description</p>
      <div className="bg-[#F8FAFC] p-3 my-4 min-h-48 rounded-2xl"></div>
    </div>
  );
}

export default FormSection;
