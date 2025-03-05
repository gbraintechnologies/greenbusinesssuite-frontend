"use client";

import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import StatsBlock from "@/components/StatsBlock/StatsBlock";

import UserIcon from "@/public/icons/UserIcon";
import services from "@/services";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteSection,
} from "@nextui-org/autocomplete";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import FormResponse from "../../forms/components/FormResponse/FormResponse";
import mergeForm from "@/utils/MergeFormFields/MergeFormFields";
import { IoIosArrowBack } from "react-icons/io";

const page = () => {
  const searchParams = useSearchParams();

  const router = useRouter();

  const userId = searchParams.get("id") ? searchParams.get("id") : "";

  const [selectedFormResponseId, setSelectedFormResponseId] = useState<any>();

  const [formsResponseList, setFormsResponseList] = useState<any>([]);

  const [responsesLoading, setResponsesLoading] = useState<boolean>(false);

  const [selectedResponse, setSelectedResponse] = useState<any>();

  const pdfRef = React.useRef(null);

  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ["user", userId ? parseInt(userId) : null],
    queryFn: services.userByID(userId),
    enabled: Boolean(userId),
  });

  const { data: userForms, isLoading: areUserFormsLoading } = useQuery({
    queryKey: ["get forms for ", Number(userId)],
    queryFn: services.getFormsByUserId(userId),
  });

  const { data: formsStats, isLoading: areStatsLoading } = useQuery({
    queryKey: ["get forms statistics for user", userId],
    queryFn: services.getFormStatisticsForUser(userId),
    enabled: Boolean(userId),
  });

  async function mergeAllResponsesWithForms(response: any) {
    setResponsesLoading(true);
    try {
      let form = await services.getFormByIdRawForUser(response.formId);

      if (form) {
        setFormsResponseList((prev: any) => [
          ...prev,
          mergeForm(response?.id, form?.data, response?.inputData),
        ]);
      }
      setResponsesLoading(false);
    } catch (e) {
      // console.log("error in merging all responses", e);
    }
  }

  useEffect(() => {
    if (userForms) {
      // initialize to 0 to prevent duplicates
      setFormsResponseList([]);

      // populate list
      for (let i = 0; i < userForms?.length; i++) {
        mergeAllResponsesWithForms(userForms[i]);
      }
    }
  }, [userForms]);

  // const fetchSelectedFormsResponse = async () => {
  //   try {
  //     setResponsesLoading(true);

  //     const formUserResponse = userForms?.find(
  //       (item: any) => item.formId == selectedFormId
  //     );

  //     let mergedForm = mergeForm(
  //       formUserResponse?.id,
  //       selectedForm,
  //       formUserResponse?.inputData
  //     );

  //     setMergedForm(mergedForm);
  //   } catch (error) {
  //   } finally {
  //     setResponsesLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   if (!!selectedForm && !isLoading) fetchSelectedFormsResponse();
  // }, [selectedFormId, selectedForm, isLoading]);

  useEffect(() => {
    if (!!selectedFormResponseId) {
      setSelectedResponse(
        formsResponseList.find(
          (item: any) => item.responseId == selectedFormResponseId
        )
      );
    }
  }, [selectedFormResponseId]);

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
    <div className="px-5 pb-20 bg-[#F8FAFC] pt-4 min-h-[100vh]">
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
      <div className="mt-5 max-w-md hide-input-borders">
        <Autocomplete
          isDisabled={formsResponseList < 1}
          variant="flat"
          isLoading={responsesLoading}
          className="bg-white flex items-center justify-between shadow-none border rounded-xl px-2 w-full text-left"
          scrollShadowProps={{
            isEnabled: false,
          }}
          defaultSelectedKey={formsResponseList[0]?.responseId}
          onSelectionChange={(key) => {
            setSelectedFormResponseId(key);
          }}
        >
          <AutocompleteSection className="shadow-md bg-white border border-[#F1F5F9] rounded-lg w-full flex flex-col gap-3">
            {formsResponseList?.map((form: any) => (
              <AutocompleteItem
                key={form?.responseId}
                className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
              >
                {form?.name}
              </AutocompleteItem>
            ))}
          </AutocompleteSection>
        </Autocomplete>

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
            {formsList?.map((form: any) => (
              <DropdownItem
                key="view"
                className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
                onPress={() => setSelectedFormId(form?.id)}
              >
                {form?.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown> */}
      </div>

      <div className="mt-4 mb-4">
        {selectedResponse?.name && (
          <div className="bg-white p-4 rounded-xl mb-5">
            <p>Selected Form Response</p>
            <h4 className="text-xl font-semibold">
              {selectedResponse?.name} Response
            </h4>
          </div>
        )}
        {responsesLoading ? (
          <div className="h-[10rem] flex items-center justify-center">
            <LoadingIcon />
          </div>
        ) : (
          <FormResponse mergedForm={selectedResponse} ref={pdfRef} />
        )}
      </div>
    </div>
  );
};

export default page;
