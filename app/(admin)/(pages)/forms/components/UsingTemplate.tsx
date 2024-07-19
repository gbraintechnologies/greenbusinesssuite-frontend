"use client";

import React, { useState } from "react";

//
import { useQuery, useQueryClient } from "@tanstack/react-query";
import services from "@/services";

//
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import FormPreviewIcon from "@/public/icons/FormPreviewIcon";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

//

function UsingTemplate() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();
  const { data: forms, isLoading } = useQuery({
    queryKey: ["form templates"],
    queryFn: services.allFormTemplates(),
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
        <div className="h-[20rem] flex items-center justify-center">
          <div>
            <LoadingIcon />
            <p className="mt-2 text-xs text-gray-500">Fetching templates</p>
          </div>
        </div>
      ) : (
        // ALL FORMS
        <>
          {forms?.length === 0 ? (
            <div className=" h-[30rem] flex items-center justify-center">
              No template found
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-5 mt-5">
              {forms &&
                forms
                  .filter((form: any) => form?.isTemplate === true)
                  ?.map((form: any) => {
                    const { id, name } = form;
                    return (
                      <button
                        onClick={() => {
                          useTemplate(form);
                        }}
                        className="w-full hover:shadow-md rounded-lg  bg-[#F8FAFC]"
                      >
                        <div
                          className={`flex items-center bg-gradient-to-br from-indigo-950 to bg-gray-900 justify-center w-full h-[10rem] rounded-tl-lg rounded-tr-lg`}
                        >
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
          )}
        </>
      )}
    </div>
  );
}

export default UsingTemplate;
