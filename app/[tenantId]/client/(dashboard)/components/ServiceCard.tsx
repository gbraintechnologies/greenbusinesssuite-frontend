"use client";

import React from "react";

import { useRouter } from "next/navigation";

import FormPreviewIcon from "@/public/icons/FormPreviewIcon";

// components
import { toast } from "sonner";

import services from "@/services";
import useCompany from "@/hooks/useCompany";
import { BsArrowRight } from "react-icons/bs";
import useUser from "@/hooks/useUser";

type Props = {
  form: any;
  addFormResponses?: boolean;
  onClick?: () => void;
};
function ServiceCard({ form }: Props) {
  let { id, name } = form;

  const router = useRouter();

  const { companyBranding: company } = useCompany();

  // current client
  const { user } = useUser();

  const startApplication = () => {
    toast.error("Creating application. Please wait...");

    if (form) {
      // CHECK IF DEADLINE OR DATE IS OVER

      if (form?.deadline !== null) {
        if (new Date() > new Date(form?.deadline)) {
          toast.error("The deadline for applying to this sevice is over");
          return;
        }
      }

      // STRIP DATA TO IDS AND REPONSES
      // input data should contain all the form sections for reconstruction
      // @ts-ignore
      let formSections = [];

      for (let i = 0; i < form?.formSections?.length; i++) {
        let section = form?.formSections[i];

        // SKIP DELETED SECTIONS
        if (!section?.isDeleted) {
          let formFields = [];
          for (let j = 0; j < section?.formFields?.length; j++) {
            let field = section?.formFields[j];
            formFields.push({
              // id: field?.id,
              response: field?.response ? field?.response : "",
              formFieldId: field?.id,
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
            // id: section?.id,
            formSectionId: section?.id,
            formDataFields: formFields,
          });
        }
      }

      // stripping out data under formsections and form fields
      let inputData = {
        formSections: formSections,
      };
      // ASSIGN TO USER UPON LOGIN THEN CLEAR SESSION STORAGE
      services
        .acceptInvite(id, user?.id, Number(company?.id), inputData)
        .then(async (res) => {
          toast.success("Successfully started application!");
          // console.log("accept res", res?.data);

          // start application
          router.push(
            `/${company?.company_identifier}/client/form?id=${form?.id}&company=${company?.id}`
          );

          // send email notification to company admin
          await services
            .sendFormEmailNotification(
              user?.id,
              Number(company?.id),
              Number(form?.id)
            )
            .then((res: any) => {
              // console.log("email sent ", res);
            })
            .catch((error: any) => {
              // console.log("Error ", error);
            });
        })
        .catch((e: any) => {
          toast.error(
            "There was an error processing your invite to this form. Kindly contact your company administrator. The form is either unaccessible or you have already accepted this form."
          );
          console.log("error accepting form", e);
        });
    }
  };

  return (
    <>
      <div className="w-full rounded-lg shadow-md bg-[#F8FAFC]">
        <div
          className={`flex items-center bg-gradient-to-br from-indigo-950 to bg-gray-900 justify-center w-full h-[10rem] rounded-tl-lg rounded-tr-lg`}
        >
          <FormPreviewIcon />
        </div>
        <div className="p-3">
          <h5 className="text-lg w-full text-left font-medium">
            {name?.replace(/"/g, " ")}
          </h5>
          <p className="mt-1  text-gray-600">{form?.description}</p>
          <button
            onClick={startApplication}
            className="mt-5 text-sm hover:text-black text-gray-600 py-2 rounded-xl flex w-full gap-3 items-center "
          >
            Start Application
            <BsArrowRight />
          </button>
        </div>
      </div>
    </>
  );
}

export default ServiceCard;
