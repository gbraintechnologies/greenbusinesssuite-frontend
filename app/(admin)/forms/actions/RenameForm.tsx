import React, { useState } from "react";

//
import FormPreviewIcon from "@/public/icons/FormPreviewIcon";

function RenameForm({ setShow, form }: any) {
  const [name, setName] = useState(form?.name);
  return (
    <div>
      <div className="flex mx-40 my-5 bg-gradient-to-r from-indigo-200 to-pink-400 items-center justify-center  h-[12rem] rounded-lg">
        <FormPreviewIcon />
      </div>

      <div className="my-5 mx-5">
        <label className="text-gray-400 block text-sm mb-3">Rename form</label>
        <input
          className="block focus:outline-[#16A34A] border border-gray-300 px-3 py-2 rounded-lg w-full"
          type="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className=" p-5 border-t-[1px] border-t-gray-200 flex bg-[#F1F5F9] justify-between mt-5">
        <button
          onClick={() => setShow(false)}
          className="bg-gray-50 border border-gray-200 shadow-md px-8 py-2 flex text-primary-dark text-sm hover:opacity-95 items-center gap-2 rounded-xl"
        >
          Cancel
        </button>
        <button
          className="bg-primary-green py-3 shadow-md flex text-white text-sm px-6 hover:opacity-95 items-center gap-2 rounded-xl"
          onClick={() => setShow(false)}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

export default RenameForm;
