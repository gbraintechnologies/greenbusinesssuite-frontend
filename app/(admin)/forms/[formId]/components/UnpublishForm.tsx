"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";

// icons
import { IoCopyOutline } from "react-icons/io5";

function UnpublishForm({ setShow, form }: any) {
  //
  const [name, setName] = useState("");
  return (
    <div>
      <div className="mb-5 mx-5">
        <p className="font-light mb-5">
          Unpublishing this form will make it unreachable to all companies using
          this form.
          <br />
          <br />
          Enter the name of the file to unpublish the form.
        </p>

        <div className="bg-gray-100 mt-2 mb-5 flex items-center justify-between px-3 py-2 rounded-lg">
          <p>Copy the name of this file</p>{" "}
          <button
            className=""
            onClick={() => {
              toast.success("Named copied");
            }}
          >
            <IoCopyOutline size={20} />
          </button>
        </div>
        <label className="text-gray-400 block text-sm mb-2">
          Enter the name of the form to unpublish the form
        </label>
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
          disabled={name.length < 4}
          className="bg-primary-red disabled:cursor-not-allowed disabled:bg-opacity-70 py-3 shadow-md flex text-white text-sm px-6 hover:opacity-95 items-center gap-2 rounded-xl"
          onClick={() => setShow(false)}
        >
          Unpublish this form
        </button>
      </div>
    </div>
  );
}

export default UnpublishForm;
