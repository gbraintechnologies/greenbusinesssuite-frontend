import React from "react";

//
import { useQuery } from "@tanstack/react-query";
import services from "@/services";

//
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import FormPreviewIcon from "@/public/icons/FormPreviewIcon";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function UsingTemplate() {
  const router = useRouter();

  const { data: forms, isLoading } = useQuery({
    queryKey: ["form templates"],
    queryFn: services.allFormTemplates(),
  });

  const useTemplate = (id: any) => {
    //
    toast.loading("Creating form using template");
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
                  .filter((form: any) => form.isTemplate === true)
                  ?.map((form: any) => {
                    const { id, name } = form;
                    return (
                      <button
                        onClick={() => {
                          useTemplate(id);
                        }}
                        className="w-full hover:shadow-md rounded-lg  bg-[#F8FAFC]"
                      >
                        <div
                          className={`flex items-center bg-gradient-to-tr from-blue-400 to-green-600 justify-center w-full h-[8rem] rounded-tl-lg rounded-tr-lg`}
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
