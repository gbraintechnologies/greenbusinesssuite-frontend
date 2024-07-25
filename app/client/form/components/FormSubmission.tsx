"use client";

import Modal from "@/components/Modal/Modal";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import formSubmitted from "@/public/icons/FormSubmitted.svg";

//
import { toast } from "sonner";
import Image from "next/image";
import useClientForm from "@/hooks/useClientForm";
import useUser from "@/hooks/useUser";

function FormSubmission() {
  //
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  // succes modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  //
  const router = useRouter();

  const { user } = useUser();

  //

  const {
    submitAndCompleteForm,
    savingResponses,
    clientForm,
    setSavingResponses,
  } = useClientForm();

  const finish = () => {
    toast.dismiss();
    // Check if all required fields are filled
    let data = clientForm;
    let completedRequired = true;

    for (let i = 0; i < data?.formSections?.length; i++) {
      let section = data?.formSections[i];

      for (let j = 0; j < section?.formFields?.length; j++) {
        let field = section?.formFields[j];
        if (
          (field?.response === null || field?.response === "") &&
          field?.isMandatory
        ) {
          if (field?.fieldDataType.toLowerCase() == "upload") {
            // no response for uploads
          } else {
            setSavingResponses(false);
            setShowConfirmationModal(false);
            toast.error("Please fill all required fields");
            completedRequired = false;
            return;
          }
        }
      }
    }

    setSavingResponses(false);
    setShowConfirmationModal(false);

    // Only submit if all required fields are completed
    if (completedRequired) {
      toast.loading("Submitting form. Please wait...");

      submitAndCompleteForm(user?.id)
        .then((res: any) => {
          toast.dismiss();
          setSavingResponses(false);

          // TODO:  invalidate form queries to reload cached data
          toast.dismiss();
          setShowConfirmationModal(false);
          setShowSuccessModal(true);
        })
        .catch((e: any) => {
          toast.dismiss();
          setSavingResponses(false);
          toast.error("Error submitting form. Please try again");
        });
    }
  };

  // r
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
            setShowConfirmationModal(true);
          }}
        >
          Submit
        </button>
      </div>
      <p className="mt-10 font-light mx-auto text-center text-sm text-gray-600">
        You cannot edit this form once it has been submitted for processing
      </p>

      {/* SUBMISSION CONFIRMATION */}
      <Modal
        isOpen={showConfirmationModal}
        setIsOpen={setShowConfirmationModal}
        title="Form Submission"
      >
        <div>
          <p className="px-5 mt-5 text-[#334155]">
            Are you sure you want to submit this form? you cannot make any
            changes once it has been submitted.
          </p>

          <div className=" p-5 border-t-[1px] border-t-gray-200 flex bg-[#F1F5F9] justify-between mt-5">
            <button
              onClick={() => setShowConfirmationModal(false)}
              className="bg-gray-50 border border-gray-200 shadow-md px-8 py-2 flex text-primary-dark text-sm hover:opacity-95 items-center gap-2 rounded-xl"
            >
              Cancel
            </button>
            <button
              disabled={savingResponses}
              className="bg-primary-green disabled:bg-gray-700 disabled:cursor-not-allowed py-3 shadow-md flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
              onClick={() => {
                finish();
              }}
            >
              {savingResponses ? "Please wait..." : "Yes, submit form"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showSuccessModal}
        setIsOpen={setShowSuccessModal}
        title=""
        hideClose={true}
      >
        <div className="flex -mt-12 flex-col gap-10 items-center justify-center">
          <Image
            src={formSubmitted}
            alt="form submitted"
            width={300}
            className="w-full"
            height={200}
          />
          <div className="px-5 flex flex-col items-center text-center justify-center text-[#334155]">
            <h4 className="text-center mx-auto text-xl font-semibold mb-4">
              {" "}
              Your form submission was successful
            </h4>
            <p className="text-sm font-light w-[70%] text-gray-700">
              Efficiency, Personalization, and Insights Await as You Import and
              Harness Customer Data for Strategic Growth
            </p>
          </div>

          <button
            className="bg-primary-green py-3 text-center w-[80%] mb-10  text-white px-4 hover:opacity-95 rounded-xl"
            onClick={() => {
              router.back();
            }}
          >
            Done
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default FormSubmission;
