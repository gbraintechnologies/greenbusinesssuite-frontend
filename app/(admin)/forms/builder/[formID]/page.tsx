"use client";

import { useRouter } from "next/navigation";

//
import { useQuery } from "@tanstack/react-query";
import services from "@/services";

function FormEditing({ params }: any) {
  const router = useRouter();

  const { formID } = params;

  // Get form Details
  const { data, isLoading } = useQuery({
    queryKey: ["form", formID],
    queryFn: services.getFormById(formID),
    enabled: Boolean(formID),
  });

  console.log("form data", data);

  return (
    <div className="w-full min-h-[100vh] flex gap-10 justify-between">
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

      <div className="w-1/6">
        <div className="bg-white min-h-[100vh] border-l-2 border-gray-200 p-3">
          General form settings
        </div>
      </div>
    </div>
  );
}

export default FormEditing;
