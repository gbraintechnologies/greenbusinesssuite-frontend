import React from "react";

// hooks
import useForm from "@/hooks/useForm";
import FormatDate from "@/utils/FormatDate/FormatDate";
import toast from "react-hot-toast";
import ConnectForm from "../../../[formId]/components/ConnectForm";

function Connect() {
  const { form } = useForm();

  const { updatedOn, name } = form;

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
      <ConnectForm />
    </div>
  );
}

export default Connect;
