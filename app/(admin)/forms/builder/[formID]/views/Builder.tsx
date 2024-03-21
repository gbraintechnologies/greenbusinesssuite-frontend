import { useRouter } from "next/navigation";

// icons
import { GoArrowLeft } from "react-icons/go";

// hooks
import useForm from "@/hooks/useForm";

//
import React from "react";

//
import FormatDate from "@/utils/FormatDate/FormatDate";

function Builder() {
  const router = useRouter();

  const { form } = useForm();

  const { name, updatedOn, createdOn } = form;

  return (
    <div className="pt-10 flex px-10">
      <div className="w-2/6">
        <button
          className="px-4 py-2 flex items-center gap-2 text-sm rounded-lg bg-white border border-gray-200"
          onClick={() => {
            router.back();
          }}
        >
          <GoArrowLeft />
          Exit form builder
        </button>
      </div>
      <div className="w-4/6">
        <div className="boxshadow w-full mb-10">
          <div className="p-5">
            <h5 className="font-semibold text-lg mb-1"> {name} form</h5>
            <div className="flex justify-between items-center">
              <p className="font-light text-sm">Form description</p>

              <p className="text-primary-green text-sm flex gap-2 items-center">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-green opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-green"></span>
                </span>
                <span>
                  {" "}
                  Changes saved {FormatDate(updatedOn ? updatedOn : createdOn)}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white h-60 border border-gray-100 p-3 rounded-lg">
          <p>Untitled form</p>
        </div>
      </div>
    </div>
  );
}

export default Builder;
