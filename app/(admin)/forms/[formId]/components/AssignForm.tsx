import React from "react";

function AssignForm({ setShow, form }: any) {
  return (
    <div>
      <div className="mb-5 mx-5">
        <p className="font-light mb-5">
          Select a company to assign this form to
        </p>
      </div>

      <div className=" p-5 border-t-[1px] border-t-gray-200 flex bg-[#F1F5F9] justify-between mt-5">
        <button
          onClick={() => setShow(false)}
          className="bg-gray-50 border border-gray-200 shadow-md px-8 py-2 flex text-primary-dark text-sm hover:opacity-95 items-center gap-2 rounded-xl"
        >
          Cancel
        </button>
        <button
          className="bg-primary-green disabled:cursor-not-allowed disabled:bg-opacity-70 py-3 shadow-md flex text-white text-sm px-6 hover:opacity-95 items-center gap-2 rounded-xl"
          onClick={() => setShow(false)}
        >
          Assign to new organization
        </button>
      </div>
    </div>
  );
}

export default AssignForm;
