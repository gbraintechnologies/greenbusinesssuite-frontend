"use client";

import services from "@/services";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { toast } from "sonner";
import Loader from "@/components/Loader/Loader";

function SMSSenderID({ company, companyId }: any) {
  const [senderId, setSenderId] = useState(company?.company_sms_sender_id ?? "");

  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSenderId(company?.company_sms_sender_id ?? "");
  }, [company?.company_sms_sender_id]);

  const updateSenderID = () => {
    if (!company || !companyId) {
      toast.error("Company data is not available yet");
      return;
    }

    if (senderId == null || senderId?.length < 1) {
      toast.error("Please enter a senderID");
      return;
    }
    setIsLoading(true);

    services
      .editCompanySMSSenderIDWithCustomFields(
        companyId,
        {
          ...company,
          company_sms_sender_id: senderId,
        },
        company?.company_custom_values ?? []
      )
      .then(() => {
        toast.success("Updated SMS Sender ID Successfully");
        setIsLoading(false);
        queryClient.invalidateQueries({
          queryKey: ["company", parseInt(companyId as string)],
        });
      })
      .catch(() => {
        toast.error("An error occured updating the Sender ID");
        setIsLoading(false);
      });
  };

  if (!company) {
    return (
      <div className="mt-10">
        <Loader text="Loading sender ID settings" />
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-xl  mt-10 gap-5">
      <div>
        <h3 className="text-xl text-primary-dark font-semibold">
          SMS Sender ID
        </h3>
        <p className="text-sm text-[#667085] flex gap-2 mt-3">
          <span>
            {" "}
            <IoIosInformationCircleOutline size={20} />{" "}
          </span>
          <span>
            The Company SMS Sender ID is used in the Notifications Module when
            company admins send out SMS to their clients. Without it, they would
            be unable to do so.
          </span>
        </p>
      </div>

      <div>
        <h6 className="text-lg mt-5 font-medium mb-2">
          {" "}
          Current SMS Sender ID
        </h6>

        <p
          className={`${
            company?.company_sms_sender_id
              ? "bg-primary-green text-primary-green border-primary-green text-xl"
              : "bg-red-500 text-red-600 border-red-600 text-base"
          }   border  bg-opacity-10  px-4 py-3 rounded-xl`}
        >
          {company?.company_sms_sender_id
            ? company?.company_sms_sender_id
            : "No Sender ID Set up"}
        </p>
      </div>

      <div className="text-lg mt-5 font-medium">
        Edit / Update Company SMS Sender ID
      </div>
      <input
        className="input-holder rounded-xl border border-gray-500 py-3 -mt-2"
        value={senderId}
        placeholder="SMS Sender ID"
        onChange={(e) => setSenderId(e.target.value)}
      />
      <button
        disabled={isLoading}
        className="flex w-52 items-center my-2 disabled:bg-gray-600 disabled:cursor-not-allowed  bg-primary-green  px-4 py-2 rounded-xl text-white font-medium  cursor-pointer "
        type="button"
        onClick={updateSenderID}
      >
        {isLoading ? "Updating..." : "Update SMS Sender ID"}
      </button>
    </div>
  );
}

export default SMSSenderID;
