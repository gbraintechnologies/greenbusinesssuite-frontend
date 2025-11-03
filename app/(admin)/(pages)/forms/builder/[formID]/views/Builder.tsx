import { useRouter } from "next/navigation";
import { GoArrowLeft } from "react-icons/go";
import { CiCirclePlus } from "react-icons/ci";
import { MdOutlineModeEditOutline } from "react-icons/md";
import useForm from "@/hooks/useForm";
import React, { useEffect, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { FormatDateTime } from "@/utils/FormatDate/FormatDate";
import FormSection from "../components/FormSection";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import services from "@/services";
import Loader from "@/components/BeatLoader/Loader";
import { Button, Input, Textarea, useDisclosure } from "@heroui/react";
import Modal from "@/components/Modal/HeroModal";

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

  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const {
    form,
    selectForm,
    addFormSection,
    updateNameAndDescription,
    loadingSection,
  } = useForm();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isUpdatingMeta, setIsUpdatingMeta] = useState(false);

  //
  useEffect(() => {
    if (!isObjEmpty(form)) {
      setName(form?.name);
      setDescription(form?.description);
    }
  }, [form]);

  const { data: formStatusCount } = useQuery({
    queryKey: ["Get forms status count"],
    queryFn: services.getFormStatusCountById(Number(form?.id)),
    enabled: Boolean(form?.id),
  });

  // local variables

  // set data to form if empty
  useEffect(() => {
    if (isObjEmpty(form) && data) {
      selectForm(data);
    }
  }, [data]);

  // update name and description

  // RENDERING FORM BUILDER
  if (!isObjEmpty(form)) {
    const { updatedOn, createdOn, formSections, id } = form;

    return (
      <>
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
            <div className="border border-gray-300 rounded-xl flex gap-10 p-5 justify-between bg-white w-full mb-10">
              <div className="flex-1">
                <h5 className="font-semibold text-xl w-full">
                  {form?.name?.replace(/"/g, " ")}
                </h5>

                <div className="flex gap-5 justify-between items-center">
                  <p className="font-light text-sm flex-1">
                    {form?.description}
                  </p>
                </div>

                <div className="mt-10">
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
              <button
                onClick={onOpen}
                className="border h-fit w-fit flex items-center gap-2 px-3 rouned-xl mt-2 text-sm py-2 rounded-lg hover:text-white hover:bg-black"
              >
                <MdOutlineModeEditOutline /> Update
              </button>
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

        {/* MODALS */}

        <Modal
          isOpen={isOpen}
          onOpen={onOpen}
          onOpenChange={onOpenChange}
          title="Update Details"
          size="4xl"
          content={
            <div>
              <div className="mb-10 grid grid-cols-1 gap-4">
                <Input
                  className="border rounded-xl"
                  label="Name"
                  variant="bordered"
                  maxLength={254}
                  labelPlacement="outside"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name of form"
                />
                <Textarea
                  variant="bordered"
                  label="Description"
                  maxLength={254}
                  labelPlacement="outside"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  minRows={7}
                />
              </div>

              <Button
                isLoading={isUpdatingMeta}
                isDisabled={isUpdatingMeta}
                color="primary"
                className="text-white w-full"
                onPress={async () => {
                  setIsUpdatingMeta(true);

                  updateNameAndDescription({
                    name,
                    description,
                  });

                  setTimeout(() => {
                    onClose();
                    setIsUpdatingMeta(false);
                  }, 2000);
                }}
              >
                Update Details
              </Button>
            </div>
          }
        />
      </>
    );
  }
}

export default Builder;
