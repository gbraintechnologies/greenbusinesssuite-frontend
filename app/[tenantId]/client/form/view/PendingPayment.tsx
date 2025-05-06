"use client";

import { Button } from "@nextui-org/button";
import React, { useState } from "react";
import Image from "next/image";
import success from "@/public/icons/success.svg";
import Modal from "@/components/Modal/Modal";
import { useRouter } from "next/navigation";
import useCompany from "@/hooks/useCompany";
import CompanyThemedButton from "@/components/Buttons/CompanyThemedButton";
import services from "@/services";
import { toast } from "sonner";
import { Select, SelectItem } from "@nextui-org/select";

function PendingPayment({
  paymentDetails,
  responseId,
}: {
  responseId: string;
  paymentDetails: {
    billId: string;
    status: string;
    amountPaid: 50;
    network: string;
    currency: string;
    phoneNumber: string;
    updatedOn: string;
    serviceName: string;
    customerName: string;
    customerEmail: string;
  };
}) {
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [network, setNetwork] = useState("MTN");
  const { companyBranding: company } = useCompany();
  const [requestStatus, setRequestStatus] = useState<"pending" | "success">(
    "pending"
  );
  const [loading, setLoading] = useState(false);

  const completePayment = (responseId: any) => {
    setLoading(true);

    // UPDATES
    // AIR, TIG, VOD, MTN, MAS, BNK, VIS;
    services
      .submitPaymentRequest({
        billId: paymentDetails?.billId,
        paymentMethod: "MOBILE_MONEY",
        status: "PENDING",
        network,
        responseId: responseId,
        serviceName: paymentDetails?.serviceName,
        customerEmail: paymentDetails?.customerEmail,
        customerName: paymentDetails?.customerName,
        phoneNumber: phone,
      })
      .then((res) => {
        setLoading(false);

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
          setLoading(false);
          return;
        }

        setRequestStatus("success");
        toast.success("Payment success.");
      })
      .catch((e) => {
        toast.error(
          "There was an error submitting your payment request. Please try again."
        );
      });
  };

  const inputStyle =
    "border border-gray-300 rounded-lg p-2 w-full disabled:bg-gray-100 disabled:cursor-not-allowed";

  return (
    <div>
      {paymentDetails?.status == "PENDING" && (
        <div className="mx-2 p-4 border-green-900 rounded-xl border py-5 bg-green-50">
          <h4 className="font-bold text-xl">Pending Payment</h4>
          <p className="opacity-90 text-sm font-light mt-2">
            This application is pending payments. Kindly complete your payment
            to have your application successfully processed
          </p>

          <Button
            onPress={() => {
              setShowModal(true);
            }}
            className="mt-5 px-10 bg-green-800 text-white"
          >
            Pay Ghs {paymentDetails?.amountPaid}
          </Button>
        </div>
      )}

      {/* PAYMENT MODAL */}
      <Modal isOpen={showModal} setIsOpen={setShowModal} title="">
        <>
          {requestStatus == "success" ? (
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
                    setShowModal(false);
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
              <div className="px-5 text-[#334155] -mt-10 mb-5">
                <div className="mb-5">
                  <h4 className="font-light text-sm">Amount Due</h4>
                  <p className=" mt-1 font-light text-xl">
                    GHS
                    <span className="font-bold text-3xl">
                      {paymentDetails?.amountPaid}
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
                          { name: "TELCEL", code: "VOD" },
                          { name: "AIRTELTIGO", code: "AIR" },
                        ].map((item) => (
                          <SelectItem key={item.code}>{item.name}</SelectItem>
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

              <div className=" p-5 border-t-[1px] border-t-gray-200 flex bg-[#F1F5F9] justify-between mt-5">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-50 border border-gray-200 shadow-md px-8 py-2 flex text-primary-dark text-sm hover:opacity-95 items-center gap-2 rounded-xl"
                >
                  Cancel
                </button>
                <CompanyThemedButton
                  isDisabled={loading || phone?.toString()?.length < 5}
                  className=" disabled:bg-gray-700 disabled:cursor-not-allowed py-3 shadow-md flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
                  onPress={() => {
                    completePayment(responseId);
                  }}
                >
                  {loading ? "Please wait..." : "Make Payment"}
                </CompanyThemedButton>
              </div>
            </div>
          )}
        </>
      </Modal>
    </div>
  );
}

export default PendingPayment;
