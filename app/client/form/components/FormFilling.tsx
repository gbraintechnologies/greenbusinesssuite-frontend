import { useRouter } from "next/navigation";
import React from "react";

function FormFilling({ form }: any) {
  const router = useRouter();
  return (
    <div className="w-full mt-5">
      <div className="flex justify-end">
        <button
          className=" px-4 py-2 rounded-full border border-gray-600 text-gray-600"
          onClick={() => router.push("/client")}
        >
          Save and continue later
        </button>
      </div>
    </div>
  );
}

export default FormFilling;
