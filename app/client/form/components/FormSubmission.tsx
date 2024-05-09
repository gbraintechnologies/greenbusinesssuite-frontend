"use client";

import { useRouter } from "next/navigation";
import React from "react";

//
import toast from "react-hot-toast";

function FormSubmission() {
  const router = useRouter();
  return (
    <div>
      <div className="w-full flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="border px-4 py-2 border-gray-700 rounded-lg"
        >
          Back
        </button>
        <button
          className="bg-primary-green text-white px-4 rounded-lg py-2"
          onClick={() => {
            toast.loading("Submitting form. Please wait...");

            setTimeout(() => {
              toast.dismiss();
              toast.success("Submitted successfully!");
              router.push("/client");
            }, 3000);
          }}
        >
          Submit
        </button>
      </div>
      <p className="mt-10 font-light mx-auto text-center text-sm text-gray-600">
        You cannot edit this form once it has been submitted for processing
      </p>
    </div>
  );
}

export default FormSubmission;
