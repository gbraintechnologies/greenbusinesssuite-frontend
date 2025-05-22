"use client";

import Modal from "@/components/Modal/Modal";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { toast } from "sonner";

import useClientForm from "@/hooks/useClientForm";
import useUser from "@/hooks/useUser";
import CompanyThemedButton from "@/components/Buttons/CompanyThemedButton";
import services from "@/services";
import { HiDocumentCheck } from "react-icons/hi2";
import useCompany from "@/hooks/useCompany";
import { Button } from "@nextui-org/button";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import success from "@/public/icons/success.svg";
import Border from "@/components/Border/Border";
import { Select, SelectItem } from "@nextui-org/select";

function FormSubmission({
  showOnlySubmitButton = false,
}: {
  showOnlySubmitButton?: boolean;
}) {
  //
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const [requestStatus, setRequestStatus] = useState<"pending" | "success">(
    "pending"
  );
  const [network, setNetwork] = useState("MTN");

  const { companyBranding: company } = useCompany();
  const router = useRouter();
  const { user } = useUser();
  //
  const inputStyle =
    "border border-gray-300 rounded-lg p-2 w-full disabled:bg-gray-100 disabled:cursor-not-allowed";

  const {
    submitAndCompleteForm,
    savingResponses,
    clientForm,
    removeClientForm,
    setSavingResponses,
  } = useClientForm();

  // succes modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);

  const { data: bill, error } = useQuery({
    queryKey: ["bill by formid"],
    queryFn: services.getBillByFormId(clientForm?.id),
    enabled: Boolean(clientForm?.id) && Boolean(user),
  });

  const { data: form } = useQuery({
    queryKey: ["form", clientForm.id],
    queryFn: services.getFormById(clientForm?.id),
    enabled: Boolean(clientForm?.id) && Boolean(user),
  });

  const startAnotherApplication = () => {
    toast.success("Creating application. Please wait...");

    setLoading(true);

    if (form) {
      // CHECK IF DEADLINE OR DATE IS OVER

      if (form?.deadline !== null) {
        if (new Date() > new Date(form?.deadline)) {
          setLoading(false);
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
        .acceptInvite(form?.id, user?.id, Number(company?.id), inputData)
        .then(async (res) => {
          toast.dismiss();
          toast.success("Successfully started application!");

          setLoading(false);
          removeClientForm();

          // start application
          router.push(
            `/${company?.company_identifier}/client/form?id=${form?.id}&response=${res.data}`
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
            "There was an error processing your invite to this form. The form is either unaccessible or you have already accepted this form."
          );
          toast.dismiss();
          setLoading(false);
          console.log("error accepting form", e);
        });
    }
  };

  const completePayment = (responseId: any) => {
    setLoading(true);

    // UPDATES
    // AIR, TIG, VOD, MTN, MAS, BNK, VIS;
    services
      .submitPaymentRequest({
        billId: bill?.id,
        paymentMethod: "MOBILE_MONEY",
        status: "PENDING",
        network,
        responseId: responseId,
        serviceName: form?.name,
        customerEmail: user?.email,
        customerName: user?.first_name + " " + user?.last_name,
        phoneNumber: phone,
      })
      .then((res) => {
        console.log("Submitted payment request", res);
        setLoading(false);
        setSavingResponses(false);

        const data: {
          paymentId: string;
          status: "FAILED" | "SUCCESS";
          responseCode: string;
          responseDescription: string;
          transactionId: string;
          paymentMethod: string;
        } = res.data;

        if (data.status == "FAILED") {
          toast.error(
            data?.responseDescription
              ? data.responseDescription
              : "A system error occured processing your payment"
          );
          setSavingResponses(false);
          return;
        }

        setRequestStatus("success");
        toast.success("Payment success. Form submitted.");
      })
      .catch((e) => {
        toast.error(
          "There was an error submitting your payment request. Please try again."
        );
      });
  };

  const finish = async () => {
    toast.dismiss();
    // Check if all required fields are filled
    let data = clientForm;
    let completedRequired = true;

    for (let i = 0; i < data?.formSections?.length; i++) {
      // skip checks for  sections that are not required

      let section = data?.formSections[i];

      if (section?.isDeleted) {
        // skip deleted form sections
        continue;
      }

      // sections that aren't deleted
      for (let j = 0; j < section?.formFields?.length; j++) {
        let field = section?.formFields[j];
        if (field?.isDeleted) {
          //
          // skip checks for deleted fields
          //
        } else {
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
    }

    // Only submit if all required fields are completed
    if (completedRequired) {
      toast.info("Submitting form. Please wait...");

      submitAndCompleteForm(user?.id)
        .then(async (res: any) => {
          // phone must be entered for paid forms
          if (phone?.length > 5) {
            await completePayment(res?.data?.id);
            return;
          } else {
            toast.dismiss();
            setSavingResponses(false);

            services
              .notifyCompanyAdminOfFormCompletion(user?.id, clientForm?.id)
              .then((res) => {
                // admin notified
              })
              .catch((e) => {
                console.log("error", e);
              });

            toast.dismiss();
            setShowConfirmationModal(false);
            setShowSuccessModal(true);
          }
        })
        .catch((e: any) => {
          toast.dismiss();
          setSavingResponses(false);
          toast.error("Error submitting form. Please try again");
        });
    }
  };

  return (
    <div>
      <div className="w-full flex items-center justify-between">
        {showOnlySubmitButton ? (
          <CompanyThemedButton
            className="bg-black text-white px-4 rounded-lg py-2"
            onPress={() => {
              setShowConfirmationModal(true);
            }}
          >
            Submit{" "}
            {!!bill &&
              bill?.status?.toLowerCase() == "active" &&
              " & Make Payment"}
          </CompanyThemedButton>
        ) : (
          <>
            <button
              onClick={() => router.back()}
              className="border px-4 py-2 border-gray-700 rounded-lg"
            >
              Back
            </button>
            <CompanyThemedButton
              className="bg-black text-white px-4 rounded-lg py-2"
              onPress={() => {
                setRequestStatus("pending");
                setShowConfirmationModal(true);
              }}
            >
              Submit{" "}
              {!!bill &&
                bill?.status?.toLowerCase() == "active" &&
                " & Make Payment"}
            </CompanyThemedButton>
          </>
        )}
      </div>
      {!showOnlySubmitButton && (
        <p className="mt-10 font-light mx-auto text-center text-sm text-gray-600">
          You cannot edit this form once it has been submitted for processing
        </p>
      )}

      {/* SUBMISSION CONFIRMATION */}
      <Modal
        isOpen={showConfirmationModal}
        setIsOpen={setShowConfirmationModal}
        title=""
      >
        <>
          {!!bill &&
          bill?.status?.toLowerCase() == "active" &&
          requestStatus == "success" ? (
            <>
              <div className="-mt-10 flex flex-col items-center justify-center gap-2 mb-10">
                <Image src={success} width={150} height={100} alt="success" />
                <h5 className="text-2xl font-bold">
                  Payment Request submitted
                </h5>
                <p className="-mt-1 text-gray-700 font-light w-full md:w-[50%] text-center mx-auto">
                  You will get a pop-up on your phone to complete the payment.
                </p>

                <Button
                  onPress={() => {
                    setShowConfirmationModal(false);
                    router.push(`/${company?.company_identifier}/client?tab=1`);
                  }}
                  className="bg-green-800 text-white px-20 mt-10"
                >
                  Done
                </Button>
              </div>
            </>
          ) : (
            <div>
              <h4 className="mx-5 text-xl font-bold -mt-10">
                Submit Form{" "}
                {!!bill &&
                  bill?.status?.toLowerCase() == "active" &&
                  "& Make Payment"}
              </h4>
              <p className="px-5 mt-2 text-[#334155]">
                Are you sure you want to submit this form? you cannot make any
                changes once it has been submitted.
              </p>
              {!!bill && bill?.status?.toLowerCase() == "active" && (
                <>
                  <Border />

                  <div className="px-5 text-[#334155] mb-5">
                    <div className="mb-5">
                      <h4 className="font-light text-sm">Application Fee</h4>
                      <p className=" mt-1 font-light text-xl">
                        {bill?.currency}{" "}
                        <span className="font-bold text-3xl">
                          {bill?.amount}
                        </span>
                      </p>
                      <div className="flex flex-col gap-4 mt-5">
                        <div>
                          <label className="font-light text-gray-600 text-sm mb-2 block">
                            Payment Method
                          </label>
                          <input
                            type="text"
                            min={0}
                            disabled
                            value="Mobile Money"
                            // onChange={(e) => setAmount(e.target.value)}
                            className={inputStyle}
                          />
                        </div>
                        <div>
                          <label className="font-light text-gray-600 text-sm mb-2 block">
                            Network
                          </label>
                          <Select
                            placeholder="Network"
                            value={network}
                            defaultSelectedKeys={["MTN"]}
                            onChange={(e) => setNetwork(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg"
                          >
                            {[
                              { name: "MTN", code: "MTN" },
                              { name: "TELECEL", code: "VOD" },
                              { name: "AIRTELTIGO", code: "AIR" },
                            ].map((item) => (
                              <SelectItem key={item.code}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </Select>
                        </div>
                        <div>
                          <label className="font-light text-gray-600 text-sm mb-2 block">
                            Phone Number
                          </label>
                          <input
                            type="number"
                            min={0}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className={inputStyle}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className=" p-5 border-t-[1px] border-t-gray-200 flex bg-[#F1F5F9] justify-between mt-5">
                <button
                  onClick={() => setShowConfirmationModal(false)}
                  className="bg-gray-50 border border-gray-200 shadow-md px-8 py-2 flex text-primary-dark text-sm hover:opacity-95 items-center gap-2 rounded-xl"
                >
                  Cancel
                </button>
                <CompanyThemedButton
                  isDisabled={
                    savingResponses ||
                    loading ||
                    (!!bill &&
                      bill?.status?.toLowerCase() == "active" &&
                      phone?.toString()?.length < 5)
                  }
                  className=" disabled:bg-gray-700 disabled:cursor-not-allowed py-3 shadow-md flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
                  onPress={() => {
                    finish();
                  }}
                >
                  {savingResponses ? (
                    "Please wait..."
                  ) : (
                    <>
                      Submit
                      {!!bill &&
                        bill?.status?.toLowerCase() == "active" &&
                        " & Pay"}
                    </>
                  )}
                </CompanyThemedButton>
              </div>
            </div>
          )}
        </>
      </Modal>

      <Modal
        isOpen={showSuccessModal}
        setIsOpen={setShowSuccessModal}
        title=""
        hideClose={true}
      >
        <div className="flex -mt-12 flex-col gap-10 items-center justify-center pb-10">
          <div
            className="min-h-[18rem] w-full flex items-center justify-center"
            style={{ backgroundColor: company?.color }}
          >
            <div className="w-40 h-40 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
              <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center">
                <HiDocumentCheck size={50} />
              </div>
            </div>
          </div>
          <div className="px-5 flex flex-col items-center text-center justify-center text-[#334155]">
            <h4 className="text-center mx-auto text-2xl font-semibold mb-1">
              {" "}
              Submission Successful
            </h4>
            <p className="text-sm font-light w-[70%] text-gray-700">
              Your form submission was successful and has been sent to the
              company.
            </p>
          </div>
          <div className="flex items-center gap-4 w-[90%]">
            {clientForm?.multipleForms && (
              <Button
                isDisabled={loading}
                isLoading={loading}
                onPress={startAnotherApplication}
                className="w-full bg-white rounded-xl border border-gray-200"
              >
                {loading ? "Please wait..." : "Submit another response"}
              </Button>
            )}
            <CompanyThemedButton
              className="bg-black py-3 text-center w-full  text-white px-4 hover:opacity-95 rounded-xl"
              onPress={() => {
                router.back();
              }}
            >
              Done
            </CompanyThemedButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default FormSubmission;
