import React from "react";

import toast from "react-hot-toast";

function ConnectForm({ style = "shadow" }) {
  let key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NT";

  return (
    <div className={`${style === "raw" ? "" : "boxshadow "} w-[40rem]`}>
      <div className="p-5">
        <h5 className="font-semibold text-lg mb-5">Connect form via API</h5>

        <input
          disabled
          className="block focus:outline-[#16A34A] border border-gray-300 px-3 py-2 rounded-lg w-full"
          value={key}
          type="name"
        />
      </div>

      <p className="text-sm my-3 text-[#475569] mx-5 font-light">
        Invited users will get an email that gives them access to the file.
      </p>

      <div
        className={`${
          style === "raw"
            ? ""
            : "border-t-gray-200 bg-[#F1F5F9] border-t-[1px] "
        } p-5  flex  justify-between mt-5`}
      >
        <button className="bg-gray-50 border border-gray-200 shadow-md px-8 py-2 flex text-primary-dark text-sm hover:opacity-95 items-center gap-2 rounded-xl">
          Generate new key
        </button>
        <button
          className="bg-primary-green py-3 shadow-md flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
          onClick={() => {
            navigator.clipboard.writeText(key ?? "").then(() => {
              toast.success("API Key copied!");
            });
          }}
        >
          Copy API Key
        </button>
      </div>
    </div>
  );
}

export default ConnectForm;
