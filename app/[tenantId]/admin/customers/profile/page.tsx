"use client";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import StatsBlock from "@/components/StatsBlock/StatsBlock";

import UserIcon from "@/public/icons/UserIcon";
import services from "@/services";
import { Button } from "@nextui-org/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import FormResponse from "../../forms/components/FormResponse/FormResponse";
import mergeForm from "@/utils/MergeFormFields/MergeFormFields";
import { IoIosArrowBack } from "react-icons/io";

const page = () => {
  const searchParams = useSearchParams();

  const router = useRouter();

  const userId = searchParams.get("id") ? searchParams.get("id") : "";

  const [selectedForm, setSelectedForm] = useState<any>();

  const [mergedForm, setMergedForm] = useState<any>();

  const [responsesLoading, setResponsesLoading] = useState<boolean>(false);

  const pdfRef = React.useRef(null);

  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ["user", userId ? parseInt(userId) : null],
    queryFn: services.userByID(userId),
    enabled: Boolean(userId),
  });

  // TODO: DATA SHIFTED
  // const { data: userForms, isLoading: areFormsLoading } = useQuery({
  //   queryKey: ["get forms for ", Number(userId)],
  //   queryFn: services.getFormsByUserId(userId),
  // });

  const { data: formsStats, isLoading: areStatsLoading } = useQuery({
    queryKey: ["get forms statistics for user", userId],
    queryFn: services.getFormStatisticsForUser(userId),
    enabled: Boolean(userId),
  });

  const fetchSelectedFormsResponse = async () => {
    try {
      setResponsesLoading(true);

      const data = await services.retrieveFormUserResponseRaw(
        userId,
        selectedForm?.id
      );

      let mergedForm =
        selectedForm &&
        data &&
        mergeForm(data[0]?.id, selectedForm, data[0]?.inputData);

      setMergedForm(mergedForm);
    } catch (error) {
    } finally {
      setResponsesLoading(false);
    }
  };

  // useEffect(() => {
  //   if (userForms?.length > 0) {
  //     setSelectedForm(userForms[0]);
  //   }
  // }, [userForms]);

  useEffect(() => {
    fetchSelectedFormsResponse();
  }, [selectedForm]);

  if (isUserLoading || areStatsLoading) {
    return (
      <div className="h-[20rem] flex items-center justify-center">
        <div>
          <LoadingIcon />
          <p className="mt-2 text-xs text-gray-500">Fetching user details</p>
        </div>
      </div>
    );
  }
  return (
    <div className="px-5 pb-20 bg-[#F8FAFC] pt-4 h-full">
      <button
        className="my-3 flex items-center gap-2"
        onClick={() => router.back()}
      >
        <IoIosArrowBack size={12} /> Go Back
      </button>
      <div className="flex gap-2 items-center mt-5">
        <div className="">
          {userData?.custom_profile_values &&
          userData?.custom_profile_values.find(
            (item: any) => item.custom_profile_item_id === 1
          )?.value?.length > 1 ? (
            <Image
              alt="profile"
              src={
                userData.custom_profile_values.find(
                  (item: any) => item.custom_profile_item_id === 1
                ).value
              }
              width={150}
              height={150}
              className="rounded-full w-24 h-24 object-cover"
            />
          ) : (
            <div className="bg-gray-100 w-24 h-24 flex items-center justify-center font-light text-sm rounded-full">
              <UserIcon />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-medium text-sm">
            {userData?.first_name} {userData?.last_name}
          </p>
          <p className="text-[#475569] text-sm font-normal">
            {userData?.email}
          </p>
        </div>
      </div>
      <div className="mt-8">
        <StatsBlock
          stats={[
            {
              label: "Total Number Of Entries",
              value: formsStats?.completedForms + formsStats?.uncompletedForms,
            },
            {
              label: "Number of submitted forms",
              value: formsStats?.completedForms,
            },
            {
              label: "Number of uncompleted forms",
              value: formsStats?.uncompletedForms,
            },
          ]}
        />
      </div>
      <div className="mt-5">
        {/* <Dropdown>
          <DropdownTrigger>
            <button className="border min-w-48 outline-none shadow-md border-[#E2E8F0] bg-slate-50 py-0  rounded-lg my-2">
              <div className="flex gap-2 w-full justify-between items-center py-0 px-3">
                <p className="py-2 text-[#334155] font-medium text-sm">
                  {selectedForm?.name}
                </p>

                <div className="border-l-2 border-[#E2E8F0] flex items-center justify-center">
                  <BiChevronDown size={21} />
                </div>
              </div>
            </button>
          </DropdownTrigger>
          <DropdownMenu
            className="shadow-md bg-white border border-[#F1F5F9] rounded-lg min-w-48 flex flex-col gap-3"
            aria-label="Static Actions"
            variant="flat"
            selectionMode="single"
          >
            {userForms?.map((form: any) => (
              <DropdownItem
                key="view"
                className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
                onClick={() => setSelectedForm(form)}
              >
                {form?.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown> */}
      </div>

      <div className="mt-4">
        {responsesLoading ? (
          <div className="h-[10rem] flex items-center justify-center">
            <LoadingIcon />
          </div>
        ) : (
          <FormResponse mergedForm={mergedForm} ref={pdfRef} />
        )}
      </div>
    </div>
  );
};

export default page;
