"use client";

import React, { useState } from "react";

//
import { useQuery, useQueryClient } from "@tanstack/react-query";
import services from "@/services";

//
import FormPreviewIcon from "@/public/icons/FormPreviewIcon";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// components
import DatePicker from "@/components/DatePicker/DatePicker";
import Pagination from "@/components/Pagination/Pagination";

//
// types
import { TimelineType, TimelineValues } from "@/types";
import FormGridLoader from "./FormGridLoader";

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

  // @ts-ignore
  function removeIds(data: any) {
    // If the data is an array, iterate over each item
    if (Array.isArray(data)) {
      // @ts-ignore
      return data.map((item: any) => removeIds(item));
    }

    // If the data is an object, iterate over each key
    if (typeof data === "object" && data !== null) {
      const newData = {};
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          if (key !== "id") {
            // @ts-ignore
            newData[key] = removeIds(data[key]);
          }
        }
      }
      return newData;
    }

    // If the data is not an object or array, return it as is
    return data;
  }

  const useTemplate = (form: any) => {
    setShowTemplateModal(false);
    toast.loading("Creating form using template....");
    setLoading(true);

    services
      .createNewForm({
        name: "Template - " + form?.name,
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

  return (
    <div className="px-5 pb-10">
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
              <div className="grid grid-cols-4 gap-5 mt-5">
                {forms &&
                  forms?.content
                    .filter((form: any) => form?.isTemplate === true)
                    ?.map((form: any) => {
                      const { id, name } = form;
                      return (
                        <button
                          onClick={() => {
                            useTemplate(form);
                          }}
                          className="w-full hover:shadow-md rounded-lg  bg-gray-100"
                        >
                          <div
                            className={`flex relative items-center bg-gradient-to-br from-indigo-950 to bg-gray-900 justify-center w-full h-[10rem] rounded-tl-lg rounded-tr-lg`}
                          >
                            <div className="absolute top-3 left-3 rounded-full px-3 py-1 bg-blue-100 font-semibold text-xs text-blue-900">
                              Form Template
                            </div>
                            <FormPreviewIcon />
                          </div>
                          <div className="p-3">
                            <div className="text-lg w-full text-left hover:font-semibold font-medium">
                              {name}
                            </div>
                          </div>
                        </button>
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
