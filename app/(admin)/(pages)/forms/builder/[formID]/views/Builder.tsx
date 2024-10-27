import { useRouter } from "next/navigation";

// icons
import { GoArrowLeft } from "react-icons/go";
import { CiCirclePlus } from "react-icons/ci";
import { MdContentCopy } from "react-icons/md";
import { PiTableFill } from "react-icons/pi";

// hooks
import useForm from "@/hooks/useForm";

//
import React, { useEffect, useState } from "react";

import { useAutoAnimate } from "@formkit/auto-animate/react";

//
import { FormatDateTime } from "@/utils/FormatDate/FormatDate";
import FormSection from "../components/FormSection";

//
import { useQuery, useQueryClient } from "@tanstack/react-query";
import services from "@/services";
import { toast } from "sonner";
import Loader from "@/components/BeatLoader/Loader";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";

function isObjEmpty(obj: any) {
  return Object.keys(obj).length === 0;
}

function Builder({ data, refetch, activeTab, setActiveTab }: any) {
  // scroll to top
  useEffect(() => {
    typeof window !== "undefined" && window.scrollTo(0, 0);
  }, []);

  //
  const router = useRouter();
  const queryClient = useQueryClient();

  // animation
  const [parent] = useAutoAnimate();

  const {
    form,
    selectForm,
    addFormSection,
    updateNameAndDescription,
    loadingSection,
  } = useForm();

  const { data: formStatusCount } = useQuery({
    queryKey: ["Get forms status count"],
    queryFn: services.getFormStatusCountById(Number(form?.id)),
    enabled: Boolean(form?.id),
  });

  // local variables
  const [formName, setFormName] = useState(form?.name);
  const [formDesc, setFormDesc] = useState(
    form?.description ? form?.description : "No description set"
  );

  // set data to form if empty
  useEffect(() => {
    if (isObjEmpty(form) && data) {
      selectForm(data);
    }
  }, [data]);

  // update name and description
  useEffect(() => {
    if (!isObjEmpty(form)) {
      setFormDesc(form?.description ? form?.description : "No description set");
      setFormName(form?.name);
    }
  }, [form]);

  // RENDERING FORM BUILDER
  if (!isObjEmpty(form)) {
    const { updatedOn, createdOn, formSections, id } = form;

    const rename = () => {
      toast.dismiss();
      services
        .renameForm(id, formName)
        .then((res) => {
          updateNameAndDescription({ name: formName, description: formDesc });
          queryClient.invalidateQueries({
            queryKey: ["all forms"],
          });
          queryClient.invalidateQueries({
            queryKey: ["form", id],
          });
        })
        .catch((e) => {
          toast.dismiss();
          toast.error("Error renaming form");
          console.log("error ", e);
        });
    };

    const updateDesc = () => {
      updateNameAndDescription({ name: formName, description: formDesc });
    };

    return (
      <div className="pt-10 pb-[20rem] gap-10 relative flex px-10">
        <div className={`w-1/6`}>
          <button
            className="px-4 py-2 flex items-center gap-2 text-sm rounded-lg bg-white border border-gray-200"
            onClick={() => {
              router.back();
            }}
          >
            <GoArrowLeft />
            Exit Builder
          </button>
        </div>
        <div className={`w-5/6`}>
          {/* HEADER: TITLE, DESCRIPTION & LAST UPDATED */}
          <div className="boxshadow w-full mb-10">
            <div className="p-5">
              <h5 className="font-semibold text-lg w-full">
                <input
                  value={formName?.replace(/"/g, " ")}
                  className="outline-none focus:outline-none w-full input-custom"
                  onBlur={rename}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </h5>

              <div className="flex gap-5 justify-between items-center">
                <p className="font-light text-sm flex-1">
                  {" "}
                  <input
                    value={formDesc}
                    className="outline-none focus:outline-none w-full input-custom"
                    onBlur={updateDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                  />
                </p>

                <p className="text-primary-green text-sm flex gap-2 items-center">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-green opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-green"></span>
                  </span>
                  <span>
                    {" "}
                    Changes saved{" "}
                    {FormatDateTime(updatedOn ? updatedOn : createdOn)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* FORM SECTIONS */}
          <div ref={parent} className="mt-5">
            {formSections
              ?.filter((item: any) => !item.isDeleted)
              .sort((a: any, b: any) => a?.ordering - b?.ordering)
              ?.map((section: any, idx: any) => {
                return (
                  <FormSection
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    refetch={refetch}
                    key={idx}
                    section={section}
                  />
                );
              })}
          </div>

          {/* Add New Section */}
          {formStatusCount && formStatusCount?.totalCount > 0 ? (
            <></>
          ) : (
            <div className="flex justify-end items-end w-full">
              {/* SECTION / TABLE ADDITION */}
              {/* <Dropdown>
                <DropdownTrigger>
                  <Button
                    className="bg-white border text-sm shadow-sm disabled:cursor-not-allowed disabled:opacity-90  border-gray-200 px-3 py-2 w-40 rounded-lg flex items-center justify-center gap-2"
                    isDisabled={loadingSection}
                    onClick={() => {
                      let template = {
                        name: "",
                        description: "",
                        instruction: "",
                        formFields: [],
                        isDeleted: false,
                        createdOn: new Date(),
                        updatedOn: new Date(),
                        deletedOn: null,
                      };

                      addFormSection(template);
                    }}
                    variant="bordered"
                  >
                    {loadingSection ? (
                      <Loader color="#1d1d1d" />
                    ) : (
                      <>
                        {" "}
                        <CiCirclePlus size={18} /> Add section
                      </>
                    )}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  className="shadow-md bg-white border border-[#F1F5F9]  -mt-4 rounded-lg flex flex-col gap-3"
                  aria-label="Static Actions"
                >
                  <DropdownItem
                    key="view"
                    onClick={() => {
                      let template = {
                        name: "",
                        description: "",
                        instruction: "",
                        formFields: [],
                        isDeleted: false,
                        createdOn: new Date(),
                        updatedOn: new Date(),
                        deletedOn: null,
                      };

                      addFormSection(template);
                    }}
                    className="items-center flex gap-2 w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
                  >
                    <div className="flex items-center gap-2">
                      {" "}
                      <MdContentCopy size={20} /> Section
                    </div>
                  </DropdownItem>
                  <DropdownItem
                    key="view"
                    onClick={() => {
                      let template = {
                        name: "Table Section",
                        description: "",
                        instruction: "",
                        formFields: [],
                        isTable: true,
                        isDeleted: false,
                        createdOn: new Date(),
                        updatedOn: new Date(),
                        deletedOn: null,
                      };

                      addFormSection(template);
                    }}
                    className="items-center flex-row flex gap-2 w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[#F1F5F9]"
                  >
                    <div className="flex items-center gap-2">
                      {" "}
                      <PiTableFill size={20} /> <p>Table</p>
                    </div>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown> */}

              {/* RAW SECTION ADDITION */}
              <Button
                className="bg-white border text-sm shadow-sm disabled:cursor-not-allowed disabled:opacity-90  border-gray-200 px-3 py-2 w-40 rounded-lg flex items-center justify-center gap-2"
                isDisabled={loadingSection}
                onClick={() => {
                  let template = {
                    name: "",
                    description: "",
                    instruction: "",
                    formFields: [],
                    isDeleted: false,
                    createdOn: new Date(),
                    updatedOn: new Date(),
                    deletedOn: null,
                  };

                  addFormSection(template);
                }}
                variant="bordered"
              >
                {loadingSection ? (
                  <Loader color="#1d1d1d" />
                ) : (
                  <>
                    {" "}
                    <CiCirclePlus size={18} /> Add section
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Builder;

//SECTION:
// {
//   id: 1,
//   name: "Personal Information",
//   description: "Enter your personal details.",
//   instruction: "Please provide accurate information.",
//   formFields: [

//   ],
//   isDeleted: false,
//   createdOn: "2024-03-22T09:07:40.598049",
//   updatedOn: "2024-03-22T09:07:40.598078",
//   deletedOn: null,
// },
