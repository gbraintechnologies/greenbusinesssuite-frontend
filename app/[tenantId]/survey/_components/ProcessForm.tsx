"use client";

import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import useClientPublicForm from "@/hooks/useClientPublicForm";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import FillForm from "./FillForm";
import useCompany from "@/hooks/useCompany";
import Image from "next/image";
import { HiOutlineDocument } from "react-icons/hi2";
import { FormatDateShort } from "@/utils/FormatDate/FormatDate";

function ProcessForm({ form: data }: { form: any }) {
  const searchParams = useSearchParams();

  const { selectClientForm, clientForm } = useClientPublicForm();

  const formId = searchParams.get("f");
  const companyId = searchParams.get("c");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState<string | null>(null);

  const { companyBranding } = useCompany();

  useEffect(() => {
    if (!!data) {
      setLoading(true);
      // CHECK PUBLISH STATUS: PUBLISH | UNPUBLISHED
      if (data?.publishStatus.toLowerCase() == "unpublished") {
        setLoading(false);
        setMessage(data?.name + " form is no longer accepting responses");
        return;
      }
      // CHECK IF DEADLINE OR DATE IS OVER
      if (data?.deadline !== null) {
        if (new Date() > new Date(data?.deadline)) {
          setMessage(
            data?.name +
              " form stopped accepting responses on " +
              FormatDateShort(data?.deadline)
          );
          setLoading(false);
          return;
        }
      }

      // STRIP DATA TO IDS AND REPONSES

      let formSections: any = [];

      for (let i = 0; i < data?.formSections?.length; i++) {
        let section = data?.formSections[i];

        // SKIP DELETED SECTIONS
        if (!section?.isDeleted) {
          let formFields = [];
          for (let j = 0; j < section?.formFields?.length; j++) {
            let field = section?.formFields[j];
            formFields.push({
              ...field,
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

      setLoading(false);
    }
  }, [data]);

  if (loading)
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="flex items-center justify-center gap-2 flex-col">
          <LoadingIcon />
          <p className="mt-2 text-lg font-bold">Loading</p>
          <p>Please wait..</p>
        </div>
      </div>
    );

  return (
    <div>
      {clientForm && <FillForm />}

      {/* FORM INACCESSIBLE FOR ONE REASON OR ANOTHER */}
      {message && (
        <div className="flex items-center h-screen w-screen justify-center">
          <div className="-mt-32">
            {" "}
            {companyBranding?.logo && (
              <Image
                priority
                src={companyBranding?.logo}
                width={200}
                height={200}
                className="rounded-xl w-24 h-24"
                alt="company"
              />
            )}
            <div className="px-10 py-5 bg-gray-100 rounded-xl">
              <HiOutlineDocument size={30} />
              <h1 className="text-black font-bold text-2xl mt-3">
                Form Unaccessible
              </h1>
              <p className="mt-1 font-light text-lg">{message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProcessForm;
