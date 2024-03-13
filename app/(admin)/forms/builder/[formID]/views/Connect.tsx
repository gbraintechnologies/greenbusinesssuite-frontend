import React from "react";

// hooks
import useForm from "@/hooks/useForm";
import FormatDate from "@/utils/FormatDate/FormatDate";
import toast from "react-hot-toast";

function Connect() {
  const { form } = useForm();

  const { updatedOn, name } = form;

  let key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NT";

  return (
    <div className="flex bg-[#F1F5F9] min-h-screen  flex-col gap-10 items-center">
      {/* TITLE */}
      <div className="boxshadow w-[46rem] mt-10">
        <div className="p-5">
          <h5 className="font-semibold text-lg mb-1"> {name} form</h5>
          <div className="flex justify-between items-center">
            <p className="font-light text-sm">Form description</p>

            <p className="text-primary-green text-sm flex gap-2 items-center">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-green"></span>
              </span>
              <span> Changes saved {FormatDate(updatedOn)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* CONNECT API */}
      <div className="boxshadow w-[40rem]">
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

        <div className=" p-5 border-t-[1px] border-t-gray-200 flex bg-[#F1F5F9] justify-between mt-5">
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
    </div>
  );
}

export default Connect;
