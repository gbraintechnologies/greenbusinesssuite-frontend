"use client";

import CompanyThemedButton from "@/components/Buttons/CompanyThemedButton";
import useClientPublicForm from "@/hooks/useClientPublicForm";
import React from "react";
import { toast } from "sonner";

function FormSubmitBtn() {
  const { savingResponses, submitAndCompletePublicForm, clientForm } =
    useClientPublicForm();

  const submit = () => {
    submitAndCompletePublicForm()
      .then((res: any) => {
        toast.success("Success!");
        setTimeout(() => {
          window.open(clientForm.redirectUrl, "_self");
        }, 2000);
      })
      .catch((e: any) => {
        toast.error("Error submitting form");
      });
  };

  return (
    <>
      <CompanyThemedButton
        onPress={submit}
        isDisabled={savingResponses}
        className="w-full"
      >
        {savingResponses ? "Submitting. Please wait..." : "Submit"}
      </CompanyThemedButton>
    </>
  );
}

export default FormSubmitBtn;
