"use client";

import { Menu, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";

//
import { useQuery, useQueryClient } from "@tanstack/react-query";
import services from "@/services";

//
import FormPreviewIcon from "@/public/icons/FormPreviewIcon";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// icons
import { BsThreeDots } from "react-icons/bs";
import { MdDeleteOutline } from "react-icons/md";
import { AiOutlineForm } from "react-icons/ai";

// components
import DatePicker from "@/components/DatePicker/DatePicker";
import Pagination from "@/components/Pagination/Pagination";

//
// types
import { TimelineType, TimelineValues } from "@/types";
import FormGridLoader from "./FormGridLoader";
import removeIds from "@/utils/RemoveIds/RemoveIds";

function UsingTemplate({ setShowTemplateModal }: any) {
  const router = useRouter();

  //timeline
  const [selectedTimeline, setSelectedTimeline] = useState<
    { label: TimelineValues; value: TimelineType } | undefined
  >();

  // pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);

  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();
  const { data: forms, isLoading } = useQuery({
    queryKey: ["form templates", page, limit, selectedTimeline?.value],
    queryFn: services.allFormTemplates(page, limit, selectedTimeline?.value),
  });

  const useTemplate = (form: any) => {
    setShowTemplateModal(false);
    toast.info("Creating form using template....");
    setLoading(true);

    services
      .createNewForm({
        name: "(New)" + form?.name,
        url: "",
        description: "",
        formInstruction: "",
        formSections: removeIds(form?.formSections),
        userMandatory: false,
        publishStatus: "DRAFT",
        isTemplate: false,
        isDeleted: false,
        createdOn: new Date(),
        updatedOn: new Date(),
      })
      .then((res) => {
        setLoading(false);
        toast.dismiss();
        queryClient.invalidateQueries({
          queryKey: ["all forms"],
        });
        //
        router.push(`/forms/builder/${res.data}`);
      })
      .catch((e: Error) => {
        toast.dismiss();
        toast.error("Error occured");
      });
  };

  // ACTIONS
  const actions = [
    {
      icon: <AiOutlineForm size={20} />,
      title: "Use template",

      func: (form: any) => {
        useTemplate(form);
      },
    },

    {
      icon: <MdDeleteOutline size={20} />,
      title: "Delete",
      func: (form: any) => {
        services
          .hardDeleteForm(form?.id)
          .then((res) => {
            toast.dismiss();

            toast.success("Template deleted");
            queryClient.invalidateQueries({
              queryKey: ["form templates"],
            });
          })
          .catch((e: Error) => {
            toast.dismiss();

            // @ts-ignore
            toast.error(e?.response?.data);
          });
      },
    },
  ];

  return (
    <div className="px-5 pb-10 min-h-[75vh]">
      {isLoading ? (
        <div className="min-h-[20rem] ">
          <FormGridLoader />
        </div>
      ) : (
        // ALL FORMS
        <>
          {forms?.length === 0 ? (
            <div className=" h-[30rem] flex items-center justify-center">
              No template found
            </div>
          ) : (
            <>
              <div className="flex items-center justify-end">
                <div className="flex gap-2 items-center">
                  <DatePicker
                    selectedTimeline={selectedTimeline}
                    setSelectedTimeline={setSelectedTimeline}
                  />
                  <Pagination
                    limit={limit}
                    variant="no-text"
                    page={page}
                    currentData={forms?.content}
                    setPage={setPage}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-10 mt-5">
                {forms &&
                  forms?.content
                    .filter((form: any) => form?.isTemplate === true)
                    ?.map((form: any) => {
                      const { name } = form;
                      return (
                        <div className="w-full  rounded-lg  bg-gray-50 border border-gray-200">
                          <div
                            className={`flex relative items-center bg-gradient-to-br from-indigo-950 to bg-gray-900 justify-center w-full h-[10rem] rounded-tl-lg rounded-tr-lg`}
                          >
                            <div className="absolute top-3 left-3 rounded-full px-3 py-1 bg-blue-100 font-semibold text-[9px] text-blue-900">
                              Form Template
                            </div>
                            <FormPreviewIcon />
                          </div>
                          <div className="p-3 py-4 flex justify-between  gap-4">
                            <p className="text-base font-medium">{name}</p>
                            <Menu
                              as="div"
                              className="relative z-[99999] cursor-pointer"
                            >
                              <div className="relative">
                                <Menu.Button className="relative cursor-pointer">
                                  <BsThreeDots
                                    size={20}
                                    className="cursor-pointer"
                                  />
                                </Menu.Button>
                              </div>
                              <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                              >
                                <Menu.Items className="absolute  w-52 right-1 -top-1 rounded-lg shadow-md flex flex-col bg-white text-left">
                                  {actions.map((option: any, idx: any) => {
                                    return (
                                      <Menu.Item key={idx}>
                                        <button
                                          className={`${
                                            option.title.toLowerCase() ===
                                            "delete"
                                              ? "text-red-600"
                                              : " text-gray-500"
                                          } py-3  px-4 font-light  text-left w-full flex flex-row items-center gap-2`}
                                          onClick={() => option.func(form)}
                                        >
                                          {option?.icon} {option.title}
                                        </button>
                                      </Menu.Item>
                                    );
                                  })}
                                </Menu.Items>
                              </Transition>
                            </Menu>
                          </div>
                        </div>
                      );
                    })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default UsingTemplate;
