"use client";

import CompanyThemedButton from "@/components/Buttons/CompanyThemedButton";
import useClientPublicForm from "@/hooks/useClientPublicForm";
import React, { useState } from "react";
import { toast } from "sonner";

import Modal from "@/components/Modal/Modal";

function FormSubmitBtn() {
  const { savingResponses, submitAndCompletePublicForm, clientForm } =
    useClientPublicForm();

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = () => {
    setLoading(true);
    submitAndCompletePublicForm()
      .then((res: any) => {
        setShowModal(true);
        setLoading(false);
        setTimeout(() => {
          if (clientForm?.redirectUrl) {
            if (clientForm?.redirectUrl.startsWith("https://")) {
              window.open(clientForm.redirectUrl, "_self");
            } else {
              window.open("https://" + clientForm.redirectUrl, "_self");
            }
          } else {
            window.location.reload();
          }
        }, 3000);
      })
      .catch((e: any) => {
        setLoading(false);
        toast.error("Error submitting form");
      });
  };

  return (
    <>
      <CompanyThemedButton
        onPress={submit}
        isLoading={loading}
        isDisabled={savingResponses}
        className="w-full"
      >
        {loading ? "Submitting. Please wait..." : "Submit"}
      </CompanyThemedButton>

      {/* confirmation modal */}
      <Modal
        isOpen={showModal}
        setIsOpen={setShowModal}
        title="Form submission successful"
      >
        <div className="px-5 pb-10">
          <p className="mb-10">
            Thank you! Your form submission has been successfully sent. You'll
            be redirected in 3 seconds.
          </p>
          <CompanyThemedButton
            onPress={() => {
              if (clientForm?.redirectUrl) {
                if (clientForm?.redirectUrl.startsWith("https://")) {
                  window.open(clientForm.redirectUrl, "_self");
                } else {
                  window.open("https://" + clientForm.redirectUrl, "_self");
                }
              } else {
                window.location.reload();
              }
            }}
            isDisabled={savingResponses}
            className="w-full mt-5"
          >
            All done
          </CompanyThemedButton>
        </div>
      </Modal>
    </>
  );
}

export default FormSubmitBtn;
