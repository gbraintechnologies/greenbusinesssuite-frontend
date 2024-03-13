import { useRouter } from "next/navigation";
import React from "react";

function Builder() {
  const router = useRouter();
  return (
    <div>
      {" "}
      <div className="w-1/6 pt-10">
        <button
          className="px-4 py-2  text-sm ml-10 rounded-lg bg-white border border-gray-200"
          onClick={() => {
            router.back();
          }}
        >
          {" "}
          Exit form builder
        </button>
      </div>
      <div className="w-3/6 pt-10 ">
        <div className="bg-white h-60 border border-gray-100 p-3 rounded-lg">
          <p>Untitled form</p>
        </div>
      </div>
    </div>
  );
}

export default Builder;
