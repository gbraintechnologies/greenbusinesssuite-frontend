"use client";

import React, { useEffect, useState } from "react";

// hooks
import useAuth from "@/hooks/useAuth";
import useUser from "@/hooks/useUser";

import { useQuery } from "@tanstack/react-query";
import services from "@/services";

// logo
import MeshSuiteLogo from "@/public/icons/MeshSuiteLogo";
// icons
import { AiOutlineLoading3Quarters } from "react-icons/ai";

// navigation
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import useCompany from "@/hooks/useCompany";
import Image from "next/image";
import { Button } from "@nextui-org/button";
import { toast } from "sonner";
import CompanyThemedButton from "@/components/Buttons/CompanyThemedButton";
import UnpublishedForm from "./FormAccessError";
import FormAccessError from "./FormAccessError";

function ProcessInvite({ tenantId }: any) {
  // hooks
  const { user } = useUser();
  const { auth } = useAuth();
  const { companyBranding } = useCompany();

  // params
  const router = useRouter();
  const searchParams = useSearchParams();

  // form details
  const formId = searchParams.get("f");
  let companyId = searchParams.get("c");

  // SAVE FORM ID AND COMPANY NAME IN SESSION STORAGE
  useEffect(() => {
    sessionStorage.setItem(
      "form-to-assign",
      JSON.stringify({ formId: formId, companyId: companyId })
    );
  }, [formId, companyId]);

  // loading
  const [loading, setLoading] = useState(true);

  // GET AND FORM IF AUTHENTICATED
  const { data, error } = useQuery({
    queryKey: ["form", formId],
    queryFn: services.getFormByIdDefault(formId),
    enabled: Boolean(formId) && Boolean(auth?.access_token),
  });

  // if(Boolean(error)){
  // // @ts-ignore
  //   toast.error("Error occured", {description: error?.response?.error})
  // }

  // PROMPT TO LOGIN / CREATE ACCOUNT TO FILL FORM IF NOT AUTHENTICATED
  if (!Boolean(auth?.access_token) && !Boolean(user?.id)) {
    return (
      <div className="h-[100vh] w-full flex items-center justify-center bg-[#F1F5F9]">
        <div className="flex -mt-[20vh] items-center text-center justify-center flex-col gap-2">
          {/* <MeshSuiteLogo /> */}

          {companyBranding?.logo && (
            <Image
              src={companyBranding?.logo}
              width={100}
              height={100}
              className="rounded-full p-1 bg-white"
              alt="company"
            />
          )}
          <h1 className="mt-5 text-3xl text-primary-dark font-semibold">
            {companyBranding?.name}
          </h1>

          <h3 className="mt-5  text-xl font-semibold text-primary-dark">
            Create an account / log in
          </h3>

          <p className="max-w-sm text-lg text-primary-dark">
            To access this form you need to login or create your account
          </p>

          <CompanyThemedButton
            onClick={() =>
              router.push(
                `/${tenantId}/auth/login?redirect=invitiation&f=${formId}&c=${companyId}`
              )
            }
            className="mt-10  disabled:cursor-not-allowed text-white rounded-lg py-3 px-4"
            type="submit"
          >
            Go to authentication
          </CompanyThemedButton>
        </div>
      </div>
    );
  }

  // GET RIGHT COMPANY NAME FROM COMPANIES ENDPOINT

  const [message, setMessage] = useState("");

  //setting the status
  const [status, setStatus] = useState("");

  //form deadline
  const [formDeadline, setFormDeadline] = useState();

  useEffect(() => {
    //
    if (data && user) {
      // console.log("data", data);
      // CHECK PUBLISH STATUS: PUBLISH | UNPUBLISHED

      if (data?.publishStatus !== "PUBLISHED") {
        setLoading(false);
        setStatus("unpublished");
        return;
      }
      // CHECK IF DEADLINE OR DATE IS OVER
      // TODO: CHECK DEADLINE
      if (data?.deadline !== null) {
        if (new Date() > new Date(data?.deadline)) {
          setFormDeadline(data?.deadline);
          setLoading(false);
          setStatus("late");
          return;
        }
      }

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
        .acceptInvite(formId, user?.id, Number(companyId), inputData)
        .then((res) => {
          setLoading(false);
          setMessage(
            "Successfully accepted invitation. Please proceed to your dashboard to fill the form"
          );
        })
        .catch((e: any) => {
          setLoading(false);
          setMessage(
            "There was an error processing your invite to this form. Kindly contact your company administrator. The form is either unaccessible or you have already accepted this form."
          );
          console.log("error accepting form", e);
        });
    }
  }, [data]);

  if (loading) {
    return (
      <div className="h-[100vh] w-full flex items-center justify-center bg-[#F1F5F9]">
        <div className="flex -mt-[30vh] items-center text-center justify-center flex-col gap-2">
          {companyBranding?.logo && (
            <Image
              src={companyBranding?.logo}
              width={100}
              height={100}
              className="rounded-full p-1 bg-white"
              alt="company"
            />
          )}

          <h3 className="mt-10 font-bold text-2xl text-primary-dark">
            Processing form invite
          </h3>

          <p className="max-w-sm text-lg text-primary-dark">
            Hang on! We're processing your invite to this form...
          </p>

          <AiOutlineLoading3Quarters
            size={24}
            className="animate-spin text-gray-500 mt-10"
          />
        </div>
      </div>
    );
  }

  if (status === "late") {
    return (
      <FormAccessError
        text={
          formDeadline
            ? `Sorry, the deadline for the form you are trying to access passed on ${new Date(
                formDeadline
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}`
            : "Sorry, the deadline for the form you are trying to access passed"
        }
        subtext="If you have any questions or require assistance, please contact your company administrator."
        onClick={() => router.push(`/${tenantId}/client`)}
        btnColor={companyBranding.color}
      />
    );
  }
  if (status === "unpublished") {
    return (
      <FormAccessError
        text="Sorry, the form you are trying to access is unpublished"
        subtext="If you have any questions or require assistance, please contact your company administrator."
        onClick={() => router.push(`/${tenantId}/client`)}
        btnColor={companyBranding.color}
      />
    );
  }
  return (
    <div>
      <div className="h-[100vh] w-full flex items-center justify-center bg-[#F1F5F9]">
        <div className="flex -mt-[30vh] items-center text-center justify-center flex-col gap-2">
          {companyBranding?.logo && (
            <Image
              src={companyBranding?.logo}
              width={100}
              height={100}
              className="rounded-full p-1 bg-white"
              alt="company"
            />
          )}

          <h3 className="mt-10 font-bold text-2xl text-primary-dark">
            {data?.name} form
          </h3>

          <p className="max-w-sm text-lg text-primary-dark">{message}</p>

          <Button
            style={{
              backgroundColor: companyBranding.color,
            }}
            onClick={() => router.push(`/${tenantId}/client`)}
            className="mt-10  disabled:cursor-not-allowed text-white rounded-lg py-3 px-4"
            type="submit"
          >
            Continue to dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProcessInvite;
