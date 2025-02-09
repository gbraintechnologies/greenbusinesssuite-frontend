"use client";

import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import useClientPublicForm from "@/hooks/useClientPublicForm";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import FillForm from "./FillForm";

function ProcessForm({ form: data }: { form: any }) {
  const searchParams = useSearchParams();

  const { selectClientForm, clientForm } = useClientPublicForm();

  const formId = searchParams.get("f");
  const companyId = searchParams.get("c");

  const [loading, setLoading] = useState(false);

  //setting the status
  const [status, setStatus] = useState("");

  //form deadline
  const [formDeadline, setFormDeadline] = useState();

  useEffect(() => {
    if (!!data) {
      // CHECK PUBLISH STATUS: PUBLISH | UNPUBLISHED
      // if (data?.publishStatus !== "PUBLISHED") {
      //   setLoading(false);
      //   setStatus("unpublished");
      //   return;
      // }
      // CHECK IF DEADLINE OR DATE IS OVER
      // TODO: CHECK DEADLINE
      // if (data?.deadline !== null) {
      //   if (new Date() > new Date(data?.deadline)) {
      //     setFormDeadline(data?.deadline);
      //     setLoading(false);
      //     setStatus("late");
      //     return;
      //   }
      // }

      // STRIP DATA TO IDS AND REPONSES
      // input data should contain all the form sections for reconstruction
      // @ts-ignore
      let formSections = [];

      for (let i = 0; i < data?.formSections?.length; i++) {
        let section = data?.formSections[i];

        // SKIP DELETED SECTIONS
        if (!section?.isDeleted) {
          let formFields = [];
          for (let j = 0; j < section?.formFields?.length; j++) {
            let field = section?.formFields[j];
            formFields.push({
              id: field?.id,
              response: "",
              formFieldId: field?.id,
              label: field.label,
              placeHolder: field.placeHolder,
              name: field.name,
              fieldDataType: field?.fieldDataType,
              fieldName: field?.name,
              isStatisticalField: field?.isStatisticalField
                ? field?.isStatisticalField
                : false,
              statisticalFunction: field?.statisticalFunction
                ? field?.statisticalFunction
                : "",
              displayType: field?.displayType ? field?.displayType : "",
            });
          }
          formSections.push({
            id: section?.id,
            name: section?.name,
            formSectionId: section?.id,
            formFields: formFields,
          });
        }
      }

      selectClientForm({
        formId: parseInt(formId!),
        isCompleted: false,
        ...data,
        formSections: formSections,
        status: "PENDING",
        companyId: companyId,
      });
    }
  }, [data]);

  // TODO: show modals for deadline and unpublished

  return (
    <div>
      {clientForm ? (
        <FillForm />
      ) : (
        <div className="w-screen h-screen flex items-center justify-center">
          <div className="flex items-center justify-center gap-2 flex-col">
            <LoadingIcon />
            <p className="mt-2 text-lg font-bold">Loading</p>
            <p>Please wait..</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProcessForm;
